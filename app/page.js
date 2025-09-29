import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, Briefcase, Clock, Link as LinkIcon, ClipboardList } from 'lucide-react'

// Array de módulos para generar el menú
const modules = [
  { 
    name: "CRUD de Usuarios", 
    description: "Gestión completa de empleados.", 
    href: "/usuarios",
    icon: Users
  },
  { 
    name: "CRUD de Cargos", 
    description: "Administración de los puestos de trabajo.", 
    href: "/cargos",
    icon: Briefcase
  },
  { 
    name: "CRUD de Horarios", 
    description: "Creación y edición de turnos de entrada/salida.", 
    href: "/horarios",
    icon: Clock
  },
  { 
    name: "Asignación Usuario-Cargo-Horario", 
    description: "Módulo para enlazar un empleado a un cargo y horario específico.", 
    href: "/usuarios_cargos",
    icon: LinkIcon
  },
  { 
    name: "Reporte RPC", 
    description: "Consulta de usuarios filtrada por cargo (usa función de Supabase).", 
    href: "/consultas",
    icon: ClipboardList
  },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Panel de Administración</h1>
      <p className="text-xl text-gray-500 mb-10">Selecciona un módulo para gestionar los datos del sistema.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.name} href={module.href}>
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer border-l-4 border-l-primary/70">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl">{module.name}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
      
      <p className="mt-10 text-sm text-gray-400">Desarrollado con Next.js, Supabase y shadcn/ui.</p>
    </main>
  )
}