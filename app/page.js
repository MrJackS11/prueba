// app/page.js 
import Link from 'next/link';

export default function Home() {
  return (
    // CAMBIO CLAVE: Fondo con gradiente sutil para el cuerpo
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-200">
      
      {/* Contenedor central con estilo moderno */}
      <div className="p-10 bg-white shadow-2xl rounded-xl text-center max-w-xl border-t-4 border-blue-500">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Menú Principal de CRUDs
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Selecciona una tabla para gestionar sus datos.
        </p>

        <div className="flex flex-col space-y-4">
          <Link
            href="/cargos"
            className="w-full px-8 py-3 text-lg font-bold rounded-xl text-white 
                      bg-gradient-to-r from-blue-600 to-teal-500 
                      hover:from-blue-700 hover:to-teal-600 
                      shadow-lg transition duration-300 transform hover:scale-[1.02]"
          >
            Ir a CRUD de Cargos
          </Link>
          
          {/* Aquí se agregarán los enlaces a otros CRUDs a medida que los crees */}
          <Link
            href="/usuarios"
            className="w-full px-8 py-3 text-lg font-bold rounded-xl text-gray-700 
                      bg-white border-2 border-gray-300 
                      hover:bg-gray-100 transition duration-300"
          >
            Ir a CRUD de Usuarios
          </Link>
        </div>
      </div>
    </main>
  );
}