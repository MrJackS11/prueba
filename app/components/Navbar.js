// app/components/Navbar.js

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Briefcase, Clock, Link as LinkIcon, Users, ClipboardList, Home } from 'lucide-react'
// Línea eliminada: import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const navItems = [
// ... resto del código sin cambios
  { href: '/', name: 'Inicio', icon: Home },
  { href: '/usuarios', name: 'Usuarios', icon: Users },
  { href: '/cargos', name: 'Cargos', icon: Briefcase },
  { href: '/horarios', name: 'Horarios', icon: Clock },
  { href: '/usuarios_cargos', name: 'Asignaciones', icon: LinkIcon },
  { href: '/consultas', name: 'Reporte RPC', icon: ClipboardList },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-primary">Sistema CRUD Supabase</span>
          </Link>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}