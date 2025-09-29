// app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; 
import Navbar from "./components/Navbar"; // <--- RUTA CORREGIDA: ./components/navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gestión de Personal Supabase/Next.js",
  description: "Módulos de CRUD y Reportes para el Diseño Web II",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster richColors position="top-right" /> 
      </body>
    </html>
  );
}