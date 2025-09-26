'use client'

import { useState } from 'react'
import { supabase } from '../../utils/supabase.js' // ¡Ruta Corregida!
// --- FUNCIONES DE BASE DE DATOS NECESARIAS EN SUPABASE ---
// Para que esto funcione, debes crear estas funciones en tu panel de Supabase
// (Database -> Functions).
// Ejemplo: una función simple llamada 'usuarios_con_cargo' que hace un JOIN.

const QUERIES = [
  {
    id: 1,
    name: 'Usuarios y sus cargos asignados (JOIN)',
    description: 'Muestra todos los usuarios y el cargo que tienen asignado actualmente.',
    // Utilizaremos el endpoint de Supabase (RPC) para simular la consulta
    rpcName: 'usuarios_con_cargo', // <<-- ¡DEBES CREAR ESTA FUNCIÓN EN SUPABASE!
    params: {} // Si la consulta no necesita parámetros, déjalo vacío
  },
  {
    id: 2,
    name: 'Horarios de entrada más frecuentes (Agregación)',
    description: 'Calcula y muestra la hora de entrada más común en la tabla de Horarios.',
    rpcName: 'hora_entrada_frecuente', // <<-- ¡DEBES CREAR ESTA FUNCIÓN EN SUPABASE!
    params: {}
  }
];

export default function ConsultasPage() {
  const [results, setResults] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeQuery = async (query) => {
    setLoading(true);
    setResults(null);
    setError(null);
    setCurrentQuery(query);

    try {
      // Supabase usa rpc (Remote Procedure Call) para ejecutar funciones
      const { data, error } = await supabase
        .rpc(query.rpcName, query.params);

      if (error) {
        throw error;
      }
      setResults(data);
    } catch (err) {
      console.error("Error al ejecutar la consulta:", err);
      setError(`Error: ${err.message || "No se pudo conectar con la función de base de datos."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-8 bg-gradient-to-br from-gray-50 to-gray-200">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        Resultados de Consultas Tarea 5
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Selecciona una consulta SQL para ejecutar y ver el resultado.
      </p>

      {/* Selector de Consultas */}
      <section className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-2xl mb-8 border border-t-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Seleccionar Consulta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUERIES.map((query) => (
            <button
              key={query.id}
              onClick={() => executeQuery(query)}
              disabled={loading}
              className={`p-4 text-left rounded-lg transition duration-200 shadow-md ${
                currentQuery && currentQuery.id === query.id
                  ? 'bg-blue-600 text-white transform scale-[1.02] border-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              <p className="font-semibold">{query.name}</p>
              <p className="text-xs mt-1 opacity-70">{query.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Resultados */}
      <section className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
          {currentQuery ? `Resultado: ${currentQuery.name}` : 'Resultados'}
        </h2>

        {loading && <p className="text-center text-blue-600 p-4">Cargando resultados...</p>}
        
        {error && (
          <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg">
            <strong>Error de la Base de Datos:</strong> {error}
            <p className="text-sm mt-1">
              **Asegúrate de que la Función RPC '{currentQuery?.rpcName}' existe en Supabase.**
            </p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Generar encabezados de la tabla dinámicamente */}
                  {Object.keys(results[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {/* Generar filas de datos dinámicamente */}
                    {Object.values(row).map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {results && results.length === 0 && !loading && (
          <p className="text-center text-gray-600 p-4">La consulta no arrojó resultados.</p>
        )}
      </section>
    </main>
  );
}