'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase.js' 

// Definimos el nombre de la tabla de la llave foránea para fácil edición
const MAIN_TABLE = 'cargos_usuarios';

export default function CargosUsuariosCRUD() {
  const [data, setData] = useState([])
  const [cargos, setCargos] = useState([]) // Para el combobox de cargos
  const [usuarios, setUsuarios] = useState([]) // Para el combobox de usuarios
  const [loading, setLoading] = useState(true) 
  
  // Estados para el NUEVO REGISTRO
  const [newUsuarioId, setNewUsuarioId] = useState('')
  const [newCargoId, setNewCargoId] = useState('')
  const [newFechaInicio, setNewFechaInicio] = useState('')


  // ==========================================================
  // LECTURA (R - Read): Carga la tabla principal y las opciones FK
  // ==========================================================

  // Función para obtener las opciones de los combobox (FKs)
  const fetchFKOptions = async () => {
    // 1. Obtener la lista de Usuarios para el combobox
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre'); // Necesitamos el ID (FK) y el nombre (mostrar)

    // 2. Obtener la lista de Cargos para el combobox
    const { data: cargoData, error: cargoError } = await supabase
      .from('cargos')
      .select('id, cargo'); // Necesitamos el ID (FK) y el nombre del cargo

    if (userError) console.error('Error fetching usuarios:', userError);
    if (cargoError) console.error('Error fetching cargos:', cargoError);

    setCargos(cargoData || []);
    setUsuarios(userData || []);
  };
  
  // Función principal para obtener los datos de la tabla (con JOIN para mostrar nombres)
  const fetchData = async () => {
    setLoading(true);
    // Usamos un 'JOIN' implícito de Supabase para obtener el nombre del cargo y usuario
    const { data, error } = await supabase
      .from(MAIN_TABLE)
      .select(`
        id, 
        fecha_inicio,
        id_usuario (id, nombre), // Trae el id y nombre del usuario
        id_cargo (id, cargo)     // Trae el id y nombre del cargo
      `)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFKOptions();
    fetchData();
  }, []); 


  // ==========================================================
  // CREACIÓN (C - Create): Usa los IDs seleccionados del combobox
  // ==========================================================
  const addItem = async (e) => {
    e.preventDefault();

    if (!newUsuarioId || !newCargoId || !newFechaInicio) return;
    
    const { error } = await supabase
      .from(MAIN_TABLE)
      .insert({ 
          id_usuario: newUsuarioId,
          id_cargo: newCargoId,
          fecha_inicio: newFechaInicio
      });

    if (error) {
      console.error('Error adding item:', error);
      alert(`Error al agregar registro: ${error.message}. Verifica los permisos RLS.`);
    } else {
      // Limpiar y refrescar
      setNewUsuarioId('');
      setNewCargoId('');
      setNewFechaInicio('');
      fetchData(); 
    }
  };


  // ==========================================================
  // ELIMINACIÓN (D - Delete)
  // ==========================================================
  const deleteItem = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este registro?')) return;

    const { error } = await supabase
      .from(MAIN_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
    } else {
      fetchData(); 
    }
  };


  // ==========================================================
  // RENDERIZADO (Diseño Abstracto/Moderno)
  // ==========================================================
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-8 bg-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        CRUD: Asignación de Cargos a Usuarios
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manejo de Llaves Foráneas (FK) con Comboboxes.
      </p>

      {/* Formulario para CREAR */}
      <section className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl mb-10 border border-t-4 border-teal-500">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Crear Nueva Asignación</h2>
        <form onSubmit={addItem} className="flex flex-col space-y-4">
          
          {/* COMBITBOX 1: Usuario */}
          <select
            value={newUsuarioId}
            onChange={(e) => setNewUsuarioId(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-gray-700"
            required
          >
            <option value="" disabled>Seleccionar Usuario</option>
            {usuarios.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nombre}
              </option>
            ))}
          </select>

          {/* COMBITBOX 2: Cargo */}
          <select
            value={newCargoId}
            onChange={(e) => setNewCargoId(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-gray-700"
            required
          >
            <option value="" disabled>Seleccionar Cargo</option>
            {cargos.map((cargo) => (
              <option key={cargo.id} value={cargo.id}>
                {cargo.cargo}
              </option>
            ))}
          </select>
          
          {/* FECHA DE INICIO */}
          <input
            type="date"
            value={newFechaInicio}
            onChange={(e) => setNewFechaInicio(e.target.value)}
            placeholder="Fecha de Inicio"
            className="p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-gray-700"
            required
          />

          <button 
            type="submit" 
            className="p-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-150 shadow-md"
          >
            Asignar Cargo
          </button>
        </form>
      </section>

      {/* Lista de Registros */}
      <section className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Registros Asignados</h2>
        
        {loading && <p className="text-center text-gray-500 p-4">Cargando datos...</p>}
        {!loading && data.length === 0 && <p className="text-center text-gray-600 p-4">No hay asignaciones. Crea una.</p>}

        <ul className="space-y-4">
          {data.map((item) => (
            <li 
              key={item.id} 
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg text-gray-900">
                  Usuario: {item.id_usuario ? item.id_usuario.nombre : 'N/A'}
                </p> 
                <p className="text-sm text-gray-600">
                  Cargo: {item.id_cargo ? item.id_cargo.cargo : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  Inicio: {item.fecha_inicio}
                </p>
              </div>
              <div className="space-x-2 flex-shrink-0">
                {/* Nota: La edición se vuelve muy compleja con FKs, por ahora solo mostramos Eliminar */}
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}