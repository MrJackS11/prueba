// app/components/Navbar.js

import Link from 'next/link';

export default function Navbar() {
  // --- DEFINICIÓN CONSOLIDADA DE navItems ---
  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Cargos (CRUD)', href: '/cargos' },
    { name: 'Usuarios (CRUD)', href: '/usuarios' },
    { name: 'Horarios (CRUD)', href: '/horarios' },
    { name: 'Asignaciones (FK)', href: '/usuarios_cargos' },
    { name: 'Consultas', href: '/consultas' },
  ];
  // ------------------------------------------

  return (
    // Diseño Abstracto: Gradiente oscuro y sombra profunda
    <nav className="bg-gray-900 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Título - CORREGIDO: Link sin legacyBehavior */}
          <Link 
            href="/" 
            className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 transition duration-300"
          >
            App Tarea 5
          </Link>
          
          <div className="flex space-x-2 sm:space-x-4">
            {/* Mapea la lista CONSOLIDADA - CORREGIDO: Links sin legacyBehavior */}
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-gray-300 hover:bg-gray-700 hover:text-teal-400 px-3 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}