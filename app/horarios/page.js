// app/horarios/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase.js' // ¡Ruta Corregida!

const TABLE_NAME = 'horarios';

export default function HorariosCRUD() {
  // [ESTADOS Y FUNCIONES - ADAPTAR A HORARIOS]
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true) 
  const [newIngreso, setNewIngreso] = useState('')
  const [newSalida, setNewSalida] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editIngreso, setEditIngreso] = useState('')
  const [editSalida, setEditSalida] = useState('')

  // LECTURA (R)
  const fetchData = async () => {
    setLoading(true)
    const { data: horarioData, error } = await supabase
      .from(TABLE_NAME) 
      .select('id, hora_ingreso, hora_salida') 
      .order('id', { ascending: false })

    if (error) {
      console.error(`Error fetching ${TABLE_NAME}:`, error)
    } else {
      setData(horarioData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, []) 

  // CREACIÓN (C)
  const addItem = async (e) => {
    e.preventDefault()
    if (!newIngreso.trim() || !newSalida.trim()) return 
    
    const { error } = await supabase
      .from(TABLE_NAME) 
      .insert({ hora_ingreso: newIngreso, hora_salida: newSalida })

    if (error) {
      console.error(`Error adding ${TABLE_NAME}:`, error)
      alert(`Error al agregar: ${error.message}.`)
    } else {
      setNewIngreso('')
      setNewSalida('')
      fetchData() 
    }
  }

  // ACTUALIZACIÓN (U)
  const startEdit = (item) => {
    setEditingId(item.id)
    // Supabase a veces devuelve la hora con segundos, ajustamos para la edición
    setEditIngreso(item.hora_ingreso ? item.hora_ingreso.substring(0, 5) : '') 
    setEditSalida(item.hora_salida ? item.hora_salida.substring(0, 5) : '')
  }

  const saveEdit = async (id) => {
    if (!editIngreso.trim() || !editSalida.trim()) return
    
    const { error } = await supabase
      .from(TABLE_NAME) 
      .update({ hora_ingreso: editIngreso, hora_salida: editSalida }) 
      .eq('id', id)
      
    if (error) {
      console.error(`Error updating ${TABLE_NAME}:`, error)
    } else {
      setEditingId(null)
      fetchData()
    }
  }
  const cancelEdit = () => setEditingId(null)

  // ELIMINACIÓN (D)
  const deleteItem = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este horario?')) return

    const { error } = await supabase
      .from(TABLE_NAME) 
      .delete()
      .eq('id', id) 

    if (error) {
      console.error(`Error deleting ${TABLE_NAME}:`, error)
    } else {
      fetchData() 
    }
  }

  // RENDERIZADO
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-8 bg-gray-100">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-10 mt-4">
        CRUD de Horarios
      </h1>
      
      {/* Formulario para CREAR */}
      <section className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl mb-10 border border-t-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Crear Nuevo Horario</h2>
        <form onSubmit={addItem} className="flex flex-col space-y-4">
          <input type="time" value={newIngreso} onChange={(e) => setNewIngreso(e.target.value)} placeholder="Hora de Ingreso (HH:MM)" className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700" required />
          <input type="time" value={newSalida} onChange={(e) => setNewSalida(e.target.value)} placeholder="Hora de Salida (HH:MM)" className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700" required />
          <button type="submit" className="p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
            Crear Horario
          </button>
        </form>
      </section>

      {/* Lista */}
      <section className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Lista de Horarios</h2>
        
        {loading && <p className="text-center text-gray-500 p-4">Cargando horarios...</p>}
        {!loading && data.length === 0 && <p className="text-center text-gray-600 p-4">No hay horarios. ¡Agrega uno!</p>}

        <ul className="space-y-4">
          {data.map((item) => (
            <li key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
              {editingId === item.id ? (
                // Edición
                <div className="flex-1 w-full space-y-2">
                  <input type="time" value={editIngreso} onChange={(e) => setEditIngreso(e.target.value)} className="p-2 border border-blue-400 rounded w-full text-gray-800 focus:ring-blue-500" placeholder="Ingreso" />
                  <input type="time" value={editSalida} onChange={(e) => setEditSalida(e.target.value)} className="p-2 border border-blue-400 rounded w-full text-gray-800 focus:ring-blue-500" placeholder="Salida" />
                  <div className="space-x-2 pt-2">
                    <button onClick={() => saveEdit(item.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">Guardar</button>
                    <button onClick={cancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium">Cancelar</button>
                  </div>
                </div>
              ) : (
                // Vista normal
                <>
                  <div className="mb-2 sm:mb-0">
                    <p className="font-bold text-lg text-gray-900">Ingreso: {item.hora_ingreso ? item.hora_ingreso.substring(0, 5) : 'N/A'}</p> 
                    <p className="text-sm text-gray-600">Salida: {item.hora_salida ? item.hora_salida.substring(0, 5) : 'N/A'}</p>
                  </div>
                  <div className="space-x-2 flex-shrink-0">
                    <button onClick={() => startEdit(item)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-md">Actualizar</button>
                    <button onClick={() => deleteItem(item.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md">Eliminar</button>
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