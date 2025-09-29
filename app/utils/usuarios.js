import { supabase } from './supabase' 
// Asegúrate de que el archivo './supabase' exista y esté configurado

// Obtener todos los usuarios y los detalles del cargo
export async function obtenerUsuarios() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *, // Selecciona todos los campos de la tabla 'usuarios'
        cargos ( // Obtiene los datos de la tabla 'cargos'
          cargo // Solo selecciona el nombre del cargo
        )
      `)
      .order('id', { ascending: false }) // Ordena por ID
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return { data: null, error: error.message }
  }
}

// Crear un nuevo usuario
export async function crearUsuario(usuario) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario])
      .select()
    if (error) throw error
    return { data: data[0], error: null } 
  } catch (error) {
    console.error('Error creando usuario:', error)
    return { data: null, error: error.message }
  }
}

// ✅ CORRECCIÓN: La función está correctamente exportada
export async function actualizarUsuario(id, usuario) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(usuario)
      .eq('id', id)
      .select()
    if (error) throw error
    return { data: data[0], error: null } 
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    return { data: null, error: error.message }
  }
}

// Eliminar un usuario
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
    return { error: error.message }
  }
}

// Obtener un usuario por ID 
export async function obtenerUsuarioPorId(id) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *, 
        cargos (cargo)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return { data: null, error: error.message }
  }
}