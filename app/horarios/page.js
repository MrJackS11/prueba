'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Edit, Trash2, Save, X, Clock } from 'lucide-react'
import { obtenerHorarios, crearHorario, actualizarHorario, eliminarHorario } from '../utils/horarios' 

export default function HorariosCRUD() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editIngreso, setEditIngreso] = useState('')
  const [editSalida, setEditSalida] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [newIngreso, setNewIngreso] = useState('')
  const [newSalida, setNewSalida] = useState('')

  const fetchData = async () => {
    setLoading(true)
    const { data: horariosData, error } = await obtenerHorarios()
    if (error) {
      toast.error('Error al cargar horarios: ' + error.message)
    } else {
      setData(horariosData || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCrear = async (e) => {
    e.preventDefault()
    if (!newIngreso || !newSalida) return 

    const { error } = await crearHorario({ hora_ingreso: newIngreso, hora_salida: newSalida })
    if (error) {
      toast.error('Error al crear horario: ' + error.message)
    } else {
      toast.success('Horario creado correctamente.')
      setNewIngreso('')
      setNewSalida('')
      setModalOpen(false)
      fetchData()
    }
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditIngreso(item.hora_ingreso.substring(0, 5)) 
    setEditSalida(item.hora_salida.substring(0, 5))
  }

  const saveEdit = async (id) => {
    if (!editIngreso || !editSalida) return

    const { error } = await actualizarHorario(id, { hora_ingreso: editIngreso, hora_salida: editSalida })
    if (error) {
      toast.error('Error al actualizar: ' + error.message)
    } else {
      toast.success('Horario actualizado correctamente.')
      setEditingId(null)
      fetchData()
    }
  }

  const deleteItem = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este horario?')) return

    const { error } = await eliminarHorario(id)
    if (error) {
      toast.error('Error al eliminar: ' + error.message)
    } else {
      toast.success('Horario eliminado correctamente.')
      fetchData() 
    }
  }

  const formatTime = (time) => time ? time.substring(0, 5) : 'N/A';

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl flex items-center space-x-2"><Clock className="h-6 w-6"/><span>Gestión de Horarios</span></CardTitle>
          <Button onClick={() => setModalOpen(true)}>Crear Horario</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Cargando horarios...</p>
          ) : data.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay horarios registrados.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Ingreso</TableHead>
                    <TableHead>Salida</TableHead>
                    <TableHead className="text-right w-[120px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        {editingId === item.id ? (
                          <Input type="time" value={editIngreso} onChange={(e) => setEditIngreso(e.target.value)} className="h-8" />
                        ) : (
                          formatTime(item.hora_ingreso)
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === item.id ? (
                          <Input type="time" value={editSalida} onChange={(e) => setEditSalida(e.target.value)} className="h-8" />
                        ) : (
                          formatTime(item.hora_salida) 
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editingId === item.id ? (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => saveEdit(item.id)} title="Guardar"><Save className="h-4 w-4 text-green-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} title="Cancelar"><X className="h-4 w-4 text-gray-500" /></Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => startEdit(item)} title="Editar"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} title="Eliminar"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Creación */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Definir Nuevo Horario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCrear} className="space-y-4">
            <label htmlFor="new-ingreso" className="text-sm font-medium">Hora de Ingreso</label>
            <Input id="new-ingreso" type="time" value={newIngreso} onChange={(e) => setNewIngreso(e.target.value)} required />
            
            <label htmlFor="new-salida" className="text-sm font-medium">Hora de Salida</label>
            <Input id="new-salida" type="time" value={newSalida} onChange={(e) => setNewSalida(e.target.value)} required />
            
            <DialogFooter>
              <Button type="submit">Guardar Horario</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}