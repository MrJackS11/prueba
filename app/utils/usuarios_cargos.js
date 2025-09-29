'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner' 
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table' 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Link } from 'lucide-react'
// ✅ CORRECCIÓN DE IMPORTACIÓN
import { obtenerUsuarios } from '../utils/usuarios' 
import { obtenerCargos } from '../utils/cargos' 

// Estado inicial para la nueva asignación
const initialAsignacionState = {
  id_usuario: '',
  id_cargo: '',
  fecha_asignacion: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
}

export default function AsignacionesCRUD() {
  const [asignaciones, setAsignaciones] = useState([])
  const [usuarios, setUsuarios] = useState([]) // Para el dropdown de Usuarios
  const [cargos, setCargos] = useState([])   // Para el dropdown de Cargos
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [newAsignacion, setNewAsignacion] = useState(initialAsignacionState)

  const fetchData = async () => {
    setLoading(true)
    
    // 1. Obtener la lista de asignaciones
    const { data: asignacionesData, error: asignacionesError } = await obtenerAsignaciones()
    if (asignacionesError) {
      toast.error('Error al cargar asignaciones: ' + asignacionesError)
    } else {
      setAsignaciones(asignacionesData || [])
    }

    // 2. Obtener lista de Usuarios para los dropdowns
    const { data: usersData, error: usersError } = await obtenerUsuarios()
    if (usersError) {
      toast.error('Error al cargar la lista de usuarios: ' + usersError)
    } else {
      setUsuarios(usersData || [])
    }

    // 3. Obtener lista de Cargos para los dropdowns
    const { data: cargosData, error: cargosError } = await obtenerCargos()
    if (cargosError) {
      toast.error('Error al cargar la lista de cargos: ' + cargosError.message)
    } else {
      setCargos(cargosData || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCrear = async (e) => {
    e.preventDefault()
    if (!newAsignacion.id_usuario || !newAsignacion.id_cargo) return
    
    // Aseguramos que los IDs sean números y la fecha una cadena
    const dataToSend = {
        id_usuario: parseInt(newAsignacion.id_usuario),
        id_cargo: parseInt(newAsignacion.id_cargo),
        fecha_asignacion: newAsignacion.fecha_asignacion 
    }

    const { error } = await crearAsignacion(dataToSend) 
    if (error) {
      toast.error('Error al crear asignación: ' + error.message)
    } else {
      toast.success('Asignación creada correctamente.')
      setNewAsignacion(initialAsignacionState)
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

  const handleInputChange = (field, value) => {
    setNewAsignacion(prev => ({ ...prev, [field]: value }))
  }


  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl flex items-center gap-2">
                <Link className="h-6 w-6 text-blue-600" />
                Gestión de Asignaciones (Usuarios-Cargos)
            </CardTitle>
          <Button onClick={() => setModalOpen(true)}>Crear Asignación</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Cargando asignaciones...</p>
          ) : asignaciones.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay asignaciones registradas.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asignaciones.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        {item.usuarios?.nombre || `ID: ${item.id_usuario}`}
                      </TableCell>
                      <TableCell>
                        {item.cargos?.cargo || `ID: ${item.id_cargo}`}
                      </TableCell>
                      <TableCell>
                        {item.fecha_asignacion ? new Date(item.fecha_asignacion).toLocaleDateString() : 'N/A'}
                      </TableCell>
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
            <DialogTitle>Asignar Usuario a Cargo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCrear} className="space-y-4">
            {/* Dropdown de Usuarios */}
            <label className="block text-sm font-medium text-gray-700">Seleccionar Usuario</label>
            <Select 
              onValueChange={(value) => handleInputChange('id_usuario', value)}
              value={newAsignacion.id_usuario}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un usuario..." />
              </SelectTrigger>
              <SelectContent>
                {usuarios.map(user => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.nombre} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dropdown de Cargos */}
            <label className="block text-sm font-medium text-gray-700">Seleccionar Cargo</label>
            <Select 
              onValueChange={(value) => handleInputChange('id_cargo', value)}
              value={newAsignacion.id_cargo}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cargo..." />
              </SelectTrigger>
              <SelectContent>
                {cargos.map(cargo => (
                  <SelectItem key={cargo.id} value={String(cargo.id)}>
                    {cargo.cargo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selector de Fecha */}
            <label className="block text-sm font-medium text-gray-700">Fecha de Asignación</label>
            <input
                type="date"
                value={newAsignacion.fecha_asignacion}
                onChange={(e) => handleInputChange('fecha_asignacion', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <DialogFooter>
              <Button type="submit">Asignar Cargo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

// Funciones utilitarias para asignaciones
export async function obtenerAsignacionesCompletas() {
  // TODO: Implementar lógica para obtener asignaciones completas
  return { data: [], error: null };
}

export async function crearAsignacion(asignacion) {
  // TODO: Implementar lógica para crear una asignación
  return { data: null, error: null };
}

export async function eliminarAsignacion(id) {
  // TODO: Implementar lógica para eliminar una asignación
  return { data: null, error: null };
} 