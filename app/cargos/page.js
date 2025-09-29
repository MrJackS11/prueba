'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner' 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Edit, Trash2, Save, X } from 'lucide-react'
import { obtenerCargos, crearCargo, actualizarCargo, eliminarCargo } from '../utils/cargos' 

export default function CargosCRUD() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editCargoValue, setEditCargoValue] = useState('') // CAMBIO: Renombrado a editCargoValue
  const [modalOpen, setModalOpen] = useState(false)
  const [newCargoValue, setNewCargoValue] = useState('') // CAMBIO: Renombrado a newCargoValue

  const fetchData = async () => {
    setLoading(true)
    const { data: cargosData, error } = await obtenerCargos()
    if (error) {
      toast.error('Error al cargar cargos: ' + error.message)
    } else {
      setData(cargosData || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCrear = async (e) => {
    e.preventDefault()
    if (!newCargoValue.trim()) return 

    // ✅ CAMBIO CLAVE: Se envía la propiedad 'cargo' en lugar de 'descripcion'
    const { error } = await crearCargo({ cargo: newCargoValue }) 
    if (error) {
      toast.error('Error al crear cargo: ' + error.message)
    } else {
      toast.success('Cargo creado correctamente.')
      setNewCargoValue('')
      setModalOpen(false)
      fetchData()
    }
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    // ✅ CAMBIO CLAVE: Se lee 'item.cargo' en lugar de 'item.descripcion'
    setEditCargoValue(item.cargo) 
  }

  const saveEdit = async (id) => {
    if (!editCargoValue.trim()) return
    
    // ✅ CAMBIO CLAVE: Se envía la propiedad 'cargo' en lugar de 'descripcion'
    const { error } = await actualizarCargo(id, { cargo: editCargoValue })
    if (error) {
      toast.error('Error al actualizar: ' + error.message)
    } else {
      toast.success('Cargo actualizado correctamente.')
      setEditingId(null)
      fetchData()
    }
  }

  const deleteItem = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este cargo?')) return

    const { error } = await eliminarCargo(id)
    if (error) {
      toast.error('Error al eliminar: ' + error.message)
    } else {
      toast.success('Cargo eliminado correctamente.')
      fetchData() 
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl">Gestión de Cargos</CardTitle>
          <Button onClick={() => setModalOpen(true)}>Crear Cargo</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Cargando cargos...</p>
          ) : data.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay cargos registrados.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    {/* El título de la columna puede seguir siendo 'Descripción' para la UI */}
                    <TableHead>Descripción</TableHead> 
                    <TableHead className="text-right w-[120px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        {editingId === item.id ? (
                          <Input 
                            type="text" 
                            // ✅ CAMBIO CLAVE: Usa el nuevo estado editCargoValue
                            value={editCargoValue} 
                            // ✅ CAMBIO CLAVE: Actualiza el nuevo estado editCargoValue
                            onChange={(e) => setEditCargoValue(e.target.value)} 
                            className="h-8"
                          />
                        ) : (
                            // ✅ CAMBIO CLAVE: Muestra item.cargo
                          item.cargo 
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editingId === item.id ? (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => saveEdit(item.id)} title="Guardar">
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} title="Cancelar">
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => startEdit(item)} title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} title="Eliminar">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
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
            <DialogTitle>Crear Nuevo Cargo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCrear} className="space-y-4">
            <Input 
              type="text" 
              // ✅ CAMBIO CLAVE: Usa el nuevo estado newCargoValue
              value={newCargoValue} 
              // ✅ CAMBIO CLAVE: Actualiza el nuevo estado newCargoValue
              onChange={(e) => setNewCargoValue(e.target.value)} 
              placeholder="Descripción del Cargo" 
              required
            />
            <DialogFooter>
              <Button type="submit">Guardar Cargo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}