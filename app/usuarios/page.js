'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Edit, Trash2, Save, X, UserPlus, Users as UsersIcon } from 'lucide-react'
import { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../utils/usuarios' 

// Inicialización de un nuevo usuario vacío
const initialUserState = {
  nombre: '',
  email: '',
  telefono: '',
}

export default function UsuariosCRUD() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editUser, setEditUser] = useState(initialUserState)
  const [modalOpen, setModalOpen] = useState(false)
  const [newUser, setNewUser] = useState(initialUserState)

  const fetchData = async () => {
    setLoading(true)
    const { data: userData, error } = await obtenerUsuarios()
    if (error) {
      toast.error('Error al cargar usuarios: ' + error.message)
    } else {
      setData(userData || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCrear = async (e) => {
    e.preventDefault()
    if (!newUser.nombre.trim() || !newUser.email.trim()) {
      return toast.warning('Nombre y Email son obligatorios.')
    }
    
    const { error } = await crearUsuario(newUser)
    if (error) {
      toast.error('Error al crear usuario: ' + error.message)
    } else {
      toast.success('Usuario creado correctamente.')
      setNewUser(initialUserState)
      setModalOpen(false)
      fetchData()
    }
  }

  const startEdit = (user) => {
    setEditingId(user.id)
    setEditUser({ nombre: user.nombre, email: user.email, telefono: user.telefono || '' })
  }

  const saveEdit = async (id) => {
    if (!editUser.nombre.trim() || !editUser.email.trim()) {
      return toast.warning('Nombre y Email no pueden estar vacíos.')
    }
    
    const { error } = await actualizarUsuario(id, editUser)
    if (error) {
      toast.error('Error al actualizar: ' + error.message)
    } else {
      toast.success('Usuario actualizado correctamente.')
      setEditingId(null)
      fetchData()
    }
  }

  const deleteItem = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Las asignaciones relacionadas pueden fallar.')) return

    const { error } = await eliminarUsuario(id)
    if (error) {
      toast.error('Error al eliminar: ' + error.message)
    } else {
      toast.success('Usuario eliminado correctamente.')
      fetchData() 
    }
  }

  const handleChange = (e, stateSetter) => {
    const { name, value } = e.target
    stateSetter(prev => ({ ...prev, [name]: value }))
  }

  const renderEditableCell = (field, currentItem) => (
    editingId === currentItem.id ? (
      <Input 
        type={field === 'email' ? 'email' : 'text'} 
        name={field} 
        value={editUser[field]} 
        onChange={(e) => handleChange(e, setEditUser)} 
        className="h-8"
      />
    ) : (
      currentItem[field]
    )
  )

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl flex items-center space-x-2"><UsersIcon className="h-6 w-6"/><span>Gestión de Usuarios</span></CardTitle>
          <Button onClick={() => setModalOpen(true)}><UserPlus className="mr-2 h-4 w-4"/>Crear Usuario</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Cargando usuarios...</p>
          ) : data.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay usuarios registrados.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead className="text-right w-[120px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{renderEditableCell('nombre', item)}</TableCell>
                      <TableCell>{renderEditableCell('email', item)}</TableCell>
                      <TableCell>{renderEditableCell('telefono', item)}</TableCell>
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
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCrear} className="space-y-4">
            <Input 
              type="text" 
              name="nombre" 
              value={newUser.nombre} 
              onChange={(e) => handleChange(e, setNewUser)} 
              placeholder="Nombre Completo" 
              required
            />
            <Input 
              type="email" 
              name="email" 
              value={newUser.email} 
              onChange={(e) => handleChange(e, setNewUser)} 
              placeholder="Correo Electrónico" 
              required
            />
            <Input 
              type="text" 
              name="telefono" 
              value={newUser.telefono} 
              onChange={(e) => handleChange(e, setNewUser)} 
              placeholder="Teléfono (Opcional)" 
            />
            <DialogFooter>
              <Button type="submit">Guardar Usuario</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}