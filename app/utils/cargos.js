import { supabase } from './supabase'

const TABLE_NAME = 'cargos'

export async function obtenerCargos() {
  try {
    const { data, error } = await supabase
      .from('cargos')
      .select('*')
      .order('id', { ascending: false }) // Ya corregido
    if (error) throw error
    return { data, error: null }
  } catch (error) {
      console.error('Error obteniendo cargos:', error) 
      return { data: null, error: error.message || String(error) } // Importante: String(error)
  }
}

export async function crearCargo(cargo) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([cargo])
    .select()
  return { data: data ? data[0] : null, error }
}

export async function actualizarCargo(id, cargo) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(cargo)
    .eq('id', id)
    .select()
  return { data: data ? data[0] : null, error }
}

export async function eliminarCargo(id) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)
  return { error }
}