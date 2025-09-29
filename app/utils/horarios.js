import { supabase } from './supabase'

const TABLE_NAME = 'horarios'

export async function obtenerHorarios() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, hora_ingreso, hora_salida')
    .order('id', { ascending: true })
  return { data, error }
}

export async function crearHorario(horario) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([horario])
    .select()
  return { data: data ? data[0] : null, error }
}

export async function actualizarHorario(id, horario) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(horario)
    .eq('id', id)
    .select()
  return { data: data ? data[0] : null, error }
}

export async function eliminarHorario(id) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)
  return { error }
}