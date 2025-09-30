import { supabase } from './supabase'

// 1. OBTENER USUARIOS
export async function obtenerUsuarios() {
  try {
    // Nota: El join a 'cargos' podría fallar si la FK no existe en 'usuarios' o no está en 'usuarios_cargos'.
    // Lo dejo comentado si es tu problema de RLS/Join
    const { data, error } = await supabase
      .from('usuarios')
      // .select(`id, nombre, email, telefono, cargos (cargo)`) // Si falla, usa la línea de abajo
      .select(`id, nombre, email, telefono`) 
      .order('nombre', { ascending: true })

    if (error) throw new Error(error.message || 'Error desconocido de Supabase al obtener usuarios.')
    
    // Si no hiciste el join, la data viene limpia. Si usas el join, necesitarías formatear.
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return { data: null, error: error.message || error }
  }
}

// 2. CREAR USUARIO
export async function crearUsuario(usuarioData) {
  const { nombre, email, telefono } = usuarioData;
  
  if (!nombre || !email) {
    return { data: null, error: new Error("Nombre y Email son obligatorios.") };
  }

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, telefono: telefono || null }])
      .select()
      
    if (error) throw error 
    
    return { data: data[0], error: null } 
  } catch (error) {
    console.error('Error creando usuario:', error)
    return { data: null, error: error.message || error } 
  }
}

// 3. ACTUALIZAR USUARIO (¡La función que faltaba y causaba el Build Error!)
export async function actualizarUsuario(id, updatedFields) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(updatedFields)
      .eq('id', id)
      .select() 
      
    if (error) throw error
    
    return { data: data[0], error: null }
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    return { data: null, error: error.message || error }
  }
}

// 4. ELIMINAR USUARIO
export async function eliminarUsuario(id) {
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    
    return { error: null }
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    return { error: error.message || error }
  }
}