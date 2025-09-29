import { supabase } from './supabase'

/**
 * Llama a la función remota (RPC) de Supabase para obtener la información detallada
 * de los usuarios asignados a un cargo específico.
 * @param {string} cargo_descripcion - La descripción del cargo por la que filtrar.
 */
export async function obtenerInfoUsuariosPorCargo(cargo_descripcion) {
  try {
    const { data, error } = await supabase.rpc('get_user_info_by_cargo', {
      cargo_desc: cargo_descripcion // El nombre del parámetro DEBE coincidir con el de tu función RPC en Supabase
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al llamar a la función RPC:', error)
    return { data: null, error: error.message }
  }
}