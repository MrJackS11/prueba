'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase.js'

export default function Home() {
  // [CÓDIGO DE ESTADOS Y FUNCIONES CRUD - MANTENER SIN CAMBIOS]
  const [cargos, setCargos] = useState([])
  const [newCargo, setNewCargo] = useState('')
  const [newSueldo, setNewSueldo] = useState('')
  const [loading, setLoading] = useState(true) 
  const [editingId, setEditingId] = useState(null)
  const [editCargo, setEditCargo] = useState('')
  const [editSueldo, setEditSueldo] = useState('')

  // LECTURA (R - Read)
  const fetchCargos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('cargos') 
      .select('id, cargo, sueldo') 
      .order('id', { ascending: false })

    if (error) {
      console.error('Error fetching cargos:', error)
    } else {
      setCargos(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCargos()
  }, []) 

  // CREACIÓN (C - Create)
  const addCargo = async (e) => {
    e.preventDefault()
    if (!newCargo.trim()) return 
    const sueldoNumerico = parseFloat(newSueldo) || 0; 

    const { error } = await supabase
      .from('cargos') 
      .insert({ cargo: newCargo, sueldo: sueldoNumerico })

    if (error) {
      console.error('Error adding cargo:', error)
      alert(`Error al agregar cargo: ${error.message}. Verifica los permisos RLS.`)
    } else {
      setNewCargo('')
      setNewSueldo('')
      fetchCargos() 
    }
  }

  // ACTUALIZACIÓN (U - Update)
  const startEdit = (cargo) => {
    setEditingId(cargo.id)
    setEditCargo(cargo.cargo)
    // El sueldo debe ser una cadena para el input de tipo 'number'
    setEditSueldo(String(cargo.sueldo || 0)) 
  }

  const saveEdit = async (id) => {
    if (!editCargo.trim()) return
    const sueldoNumerico = parseFloat(editSueldo) || 0; 
    
    const { error } = await supabase
      .from('cargos') 
      .update({ cargo: editCargo, sueldo: sueldoNumerico }) 
      .eq('id', id)
      
    if (error) {
      console.error('Error updating cargo:', error)
    } else {
      setEditingId(null)
      fetchCargos()
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  // ELIMINACIÓN (D - Delete)
  const deleteCargo = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cargo?')) return

    const { error } = await supabase
      .from('cargos') 
      .delete()
      .eq('id', id) 

    if (error) {
      console.error('Error deleting cargo:', error)
    } else {
      fetchCargos() 
    }
  }

  // ==========================================================
  // RENDERIZADO (Diseño Mejorado)
  // ==========================================================
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <h1 className="text-5xl font-extrabold text-indigo-800 mb-10 mt-4">
        CRUD de Cargos (Supabase)
      </h1>
      <p className="text-lg text-gray-600 mb-8">Gestión de cargos y sueldos en tiempo real.</p>
      
      {/* Formulario para CREAR */}
      <section className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl mb-10 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Crear Nuevo Cargo</h2>
        <form onSubmit={addCargo} className="flex flex-col space-y-4">
          <input
            type="text"
            value={newCargo}
            onChange={(e) => setNewCargo(e.target.value)}
            placeholder="Nombre del Cargo (Ej: Desarrollador)"
            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            required
          />
          <input
            type="number" 
            value={newSueldo}
            onChange={(e) => setNewSueldo(e.target.value)}
            placeholder="Sueldo Base (Ej: 3000.00)"
            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          />
          <button 
            type="submit" 
            className="p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
          >
            Crear Cargo
          </button>
        </form>
      </section>

      {/* Lista para LEER, ACTUALIZAR y ELIMINAR */}
      <section className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Lista de Cargos</h2>
        
        {loading && <p className="text-center text-gray-500 p-4">Cargando cargos...</p>}
        {!loading && cargos.length === 0 && <p className="text-center text-gray-600 p-4">No hay cargos. ¡Agrega uno!</p>}

        <ul className="space-y-4">
          {cargos.map((cargo) => (
            <li 
              key={cargo.id} 
              // Estilo de elemento de lista más limpio
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              {editingId === cargo.id ? (
                // Formulario de edición
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={editCargo}
                    onChange={(e) => setEditCargo(e.target.value)}
                    className="p-2 border border-blue-400 rounded w-full text-gray-800 focus:ring-blue-500"
                    placeholder="Nombre del Cargo"
                  />
                  <input
                    type="number"
                    value={editSueldo}
                    onChange={(e) => setEditSueldo(e.target.value)}
                    className="p-2 border border-blue-400 rounded w-full text-gray-800 focus:ring-blue-500"
                    placeholder="Sueldo Base"
                  />
                  <div className="space-x-2 pt-2">
                    <button 
                      onClick={() => saveEdit(cargo.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Vista normal del elemento
                <>
                  <div className="mb-2 sm:mb-0">
                    <p className="font-bold text-lg text-gray-900">{cargo.cargo}</p> 
                    <p className="text-sm text-gray-600">Sueldo: **${parseFloat(cargo.sueldo).toFixed(2)}**</p>
                  </div>
                  <div className="space-x-2 flex-shrink-0">
                    <button 
                      onClick={() => startEdit(cargo)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-md"
                    >
                      Actualizar
                    </button>
                    <button 
                      onClick={() => deleteCargo(cargo.id)} 
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}