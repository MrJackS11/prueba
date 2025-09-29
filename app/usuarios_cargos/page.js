'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link, Trash2 } from 'lucide-react'
import { obtenerAsignacionesCompletas, crearAsignacion, eliminarAsignacion } from '../utils/usuarios_cargos'
import { obtenerUsuarios } from '../utils/usuarios'
import { obtenerCargos } from '../utils/cargos'
import { obtenerHorarios } from '../utils/horarios'

export default function AsignacionesCRUD() {
  const [data, setData] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [cargos, setCargos] = useState([])
  const [horarios, setHorarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [newAsignacion, setNewAsignacion] = useState({ usuario_id: '', cargo_id: '', horario_id: '' })

  const fetchData = async () => {
    setLoading(true)
    const [asignacionesRes, usuariosRes, cargosRes, horariosRes] = await Promise.all([
      obtenerAsignacionesCompletas(),
      obtenerUsuarios(),
      obtenerCargos(),
      obtenerHorarios(),
    ])

    if (asignacionesRes.error || usuariosRes.error || cargosRes.error || horariosRes.error) {
      toast.error('Error al cargar datos necesarios. Verifique sus servicios y tablas de Supabase.')
    } else {
      setData(asignacionesRes.data || [])
      setUsuarios(usuariosRes.data || [])
      setCargos(cargosRes.data || [])
      setHorarios(horariosRes.data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCrear = async (e) => {
    e.preventDefault()
    // Asegúrate de que los valores se pasen como enteros si la base de datos lo espera
    const payload = {
      usuario_id: parseInt(newAsignacion.usuario_id),
      cargo_id: parseInt(newAsignacion.cargo_id),
      horario_id: parseInt(newAsignacion.horario_id),
    }

    const { error } = await crearAsignacion(payload)
    if (error) {
      toast.error('Error al crear asignación: ' + error.message)
    } else {
      toast.success('Asignación creada correctamente.')
      setNewAsignacion({ usuario_id: '', cargo_id: '', horario_id: '' })
      setModalOpen(false)
      fetchData()
    }
  }

  const deleteItem = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta asignación?')) return

    const { error } = await eliminarAsignacion(id)
    if (error) {
      toast.error('Error al eliminar: ' + error.message)
    } else {
      toast.success('Asignación eliminada correctamente.')
      fetchData()
    }
  }

  const handleSelectChange = (field, value) => {
    setNewAsignacion(prev => ({ ...prev, [field]: value }))
  }

  const formatTime = (time) => time ? time.substring(0, 5) : 'N/A';

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl flex items-center space-x-2"><Link className="h-6 w-6"/><span>Gestión de Asignaciones (Usuarios-Cargos)</span></CardTitle>
          <Button onClick={() => setModalOpen(true)}>Crear Asignación</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Cargando asignaciones...</p>
          ) : data.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay asignaciones registradas.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead className="text-right w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.usuario?.nombre || 'N/A'}</TableCell>
                      <TableCell>{item.cargo?.descripcion || 'N/A'}</TableCell>
                      <TableCell>{formatTime(item.horario?.hora_ingreso)} - {formatTime(item.horario?.hora_salida)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} title="Eliminar">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
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
            <DialogTitle>Asignar Usuario, Cargo y Horario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCrear} className="space-y-4">
            <Select onValueChange={(value) => handleSelectChange('usuario_id', value)} value={newAsignacion.usuario_id}>
              <SelectTrigger><SelectValue placeholder="Seleccionar Usuario" /></SelectTrigger>
              <SelectContent>
                {usuarios.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.nombre} ({u.email})</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleSelectChange('cargo_id', value)} value={newAsignacion.cargo_id}>
              <SelectTrigger><SelectValue placeholder="Seleccionar Cargo" /></SelectTrigger>
              <SelectContent>
                {cargos.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.descripcion}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleSelectChange('horario_id', value)} value={newAsignacion.horario_id}>
              <SelectTrigger><SelectValue placeholder="Seleccionar Horario" /></SelectTrigger>
              <SelectContent>
                {horarios.map(h => <SelectItem key={h.id} value={h.id.toString()}>{formatTime(h.hora_ingreso)} - {formatTime(h.hora_salida)}</SelectItem>)}
              </SelectContent>
            </Select>

            <DialogFooter>
              <Button type="submit" disabled={!newAsignacion.usuario_id || !newAsignacion.cargo_id || !newAsignacion.horario_id}>Guardar Asignación</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}