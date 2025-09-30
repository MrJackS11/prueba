import { supabase } from './supabase' 

// Obtener todos los cargos
export async function obtenerCargos() {
  try {
    const { data, error } = await supabase
      .from('cargos')
      .select('id, cargo, sueldo') 
      .order('id', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error obteniendo cargos:', error)
    return { data: null, error: error.message }
  }
}

// Crear un nuevo cargo
export async function crearCargo(cargoData) {
  try {
    const { data, error } = await supabase
      .from('cargos')
      .insert([cargoData])
      .select()
    if (error) throw error
    return { data: data[0], error: null } 
  } catch (error) {
    console.error('Error creando cargo:', error);
    return { data: null, error: error?.message || JSON.stringify(error) || 'Error desconocido al crear cargo.' };
  }
}

// Actualizar un cargo
export async function actualizarCargo(id, cargoData) {
  try {
    const { data, error } = await supabase
      .from('cargos')
      .update(cargoData) 
      .eq('id', id)
      .select()
    if (error) throw error
    return { data: data[0], error: null } 
  } catch (error) {
    console.error('Error actualizando cargo:', error)
    return { data: null, error: error.message } 
  }
}

// ELIMINAR CARGO - ¡Esta es la función que faltaba!
export async function eliminarCargo(id) {
  try {
    const { error } = await supabase
      .from('cargos')
      .delete()
      .eq('id', id)
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error eliminando cargo:', error)
    return { error: error.message }
  }
}
