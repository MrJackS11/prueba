'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClipboardList, Search } from 'lucide-react'
import { obtenerCargos } from '../utils/cargos'
import { obtenerInfoUsuariosPorCargo } from '../utils/reportes'

export default function ConsultasPage() {
  const [cargos, setCargos] = useState([])
  const [reportData, setReportData] = useState(null)
  const [selectedCargo, setSelectedCargo] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Cargar la lista de cargos al inicio
  useEffect(() => {
    const loadCargos = async () => {
      const { data, error } = await obtenerCargos()
      if (error) {
        toast.error('Error al cargar la lista de cargos.')
      } else {
        setCargos(data || [])
      }
    }
    loadCargos()
  }, [])

  // Ejecutar la función RPC al seleccionar un cargo
  const handleRunReport = async () => {
    if (!selectedCargo) {
      return toast.warning('Por favor, selecciona un cargo para generar el reporte.')
    }
    
    setLoading(true)
    setReportData(null) 
    
    const { data, error } = await obtenerInfoUsuariosPorCargo(selectedCargo)

    if (error) {
      toast.error('Error en el reporte RPC: ' + error)
    } else {
      setReportData(data || [])
      toast.success(`Reporte generado para el cargo: ${selectedCargo}`)
    }
    setLoading(false)
  }
  
  const formatTime = (time) => time ? time.substring(0, 5) : 'N/A';

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center space-x-3"><ClipboardList className="h-7 w-7"/><span>Módulo de Reportes (Función RPC)</span></CardTitle>
          <CardDescription>Genera el reporte de usuarios y sus horarios filtrado por Cargo, usando la Función Remota de Supabase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex space-x-4 items-center p-4 border rounded-lg bg-white">
            <Select onValueChange={setSelectedCargo} value={selectedCargo} disabled={loading}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Selecciona el Cargo a consultar" />
              </SelectTrigger>
              <SelectContent>
                {cargos.map(c => <SelectItem key={c.id} value={c.descripcion}>{c.descripcion}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleRunReport} disabled={loading || !selectedCargo}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </div>

          {reportData !== null && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Resultados para &quot;{selectedCargo}&quot; ({reportData.length})</h3>              
              {reportData.length === 0 ? (
                <p className="text-center py-8 text-gray-500 border rounded-md">No se encontraron usuarios para este cargo.</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre de Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Horario Ingreso</TableHead>
                        <TableHead>Horario Salida</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.nombre}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{formatTime(row.hora_ingreso)}</TableCell>
                          <TableCell>{formatTime(row.hora_salida)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}