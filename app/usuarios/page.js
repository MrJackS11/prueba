// app/usuarios/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase.js' // ¡Ruta Corregida!

const TABLE_NAME = 'usuarios';

export default function UsuariosCRUD() {
  // [ESTADOS Y FUNCIONES - ADAPTAR A USUARIOS]
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true) 
  const [newNombre, setNewNombre] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newEdad, setNewEdad] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editEdad, setEditEdad] = useState('')

  // LECTURA (R)
  const fetchData = async () => {
    setLoading(true)
    const { data: userData, error } = await supabase
      .from(TABLE_NAME) 
      .select('id, nombre, email, edad') 
      .order('id', { ascending: false })

    if (error) {
      console.error(`Error fetching ${TABLE_NAME}:`, error)
    } else {
      setData(userData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, []) 

  // CREACIÓN (C)
  const addItem = async (e) => {
    e.preventDefault()
    if (!newNombre.trim() || !newEmail.trim()) return 
    
    const { error } = await supabase
      .from(TABLE_NAME) 
      .insert({ nombre: newNombre, email: newEmail, edad: parseInt(newEdad) || null })

    if (error) {
      console.error(`Error adding ${TABLE_NAME}:`, error)
      alert(`Error al agregar: ${error.message}.`)
    } else {
      setNewNombre('')
      setNewEmail('')
      setNewEdad('')
      fetchData() 
    }
  }

  // ACTUALIZACIÓN (U)
  const startEdit = (item) => {
    setEditingId(item.id)
    setEditNombre(item.nombre)
    setEditEmail(item.email)
    setEditEdad(String(item.edad || ''))
  }

  const saveEdit = async (id) => {
    if (!editNombre.trim() || !editEmail.trim()) return
    
    const { error } = await supabase
      .from(TABLE_NAME) 
      .update({ nombre: editNombre, email: editEmail, edad: parseInt(editEdad) || null }) 
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
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return

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
      <h1 className="text-5xl font-extrabold text-indigo-800 mb-10 mt-4">
        CRUD de Usuarios
      </h1>
      
      {/* Formulario para CREAR */}
      <section className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl mb-10 border border-t-4 border-indigo-500">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Crear Nuevo Usuario</h2>
        <form onSubmit={addItem} className="flex flex-col space-y-4">
          <input type="text" value={newNombre} onChange={(e) => setNewNombre(e.target.value)} placeholder="Nombre" className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" required />
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" required />
          <input type="number" value={newEdad} onChange={(e) => setNewEdad(e.target.value)} placeholder="Edad" className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" />
          <button type="submit" className="p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">
            Crear Usuario
          </button>
        </form>
      </section>

      {/* Lista */}
      <section className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Lista de Usuarios</h2>
        
        {loading && <p className="text-center text-gray-500 p-4">Cargando usuarios...</p>}
        {!loading && data.length === 0 && <p className="text-center text-gray-600 p-4">No hay usuarios. ¡Agrega uno!</p>}

        <ul className="space-y-4">
          {data.map((item) => (
            <li key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
              {editingId === item.id ? (
                // Edición
                <div className="flex-1 w-full space-y-2">
                  <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} className="p-2 border border-blue-400 rounded w-full text-gray-800 focus:ring-blue-500" placeholder="Nombre" />
                  <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="p-2 border border-blue-400 rounded w-full text-gray-800 focus:ring-blue-500" placeholder="Email" />
                  <input type="number" value={editEdad} onChange={(e) => setEditEdad(e.target.value)} className="p-2 border border-blue-400 rounded w-full text-gray-800 focus:ring-blue-500" placeholder="Edad" />
                  <div className="space-x-2 pt-2">
                    <button onClick={() => saveEdit(item.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">Guardar</button>
                    <button onClick={cancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium">Cancelar</button>
                  </div>
                </div>
              ) : (
                // Vista normal
                <>
                  <div className="mb-2 sm:mb-0">
                    <p className="font-bold text-lg text-gray-900">{item.nombre}</p> 
                    <p className="text-sm text-gray-600">Email: {item.email}</p>
                    <p className="text-xs text-gray-500">Edad: {item.edad}</p>
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