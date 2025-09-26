// app/layout.js (Modificado)

// Importa el nuevo componente Navbar
import Navbar from './components/Navbar'; 
import './globals.css'; 

export const metadata = {
  title: 'CRUD App Tarea 5',
  description: 'Gestión de tablas de Supabase.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Agrega la barra de navegación aquí */}
        <Navbar />

        {/* El {children} es el contenido de la página actual */}
        {children} 
      </body>
    </html>
  );
}