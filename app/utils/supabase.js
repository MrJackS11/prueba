// utils/supabase.js

import { createClient } from '@supabase/supabase-js'

// --- TUS CLAVES INCORPORADAS DIRECTAMENTE ---
// URL del proyecto
const supabaseUrl = 'https://ueotggyuounymbogmpzw.supabase.co' 

// Clave ANÓNIMA (pública)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb3RnZ3l1b3VueW1ib2dtcHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjM2NzgsImV4cCI6MjA3MzkzOTY3OH0.17Qkgg1zXhTT7Xsk5b_X06E1nSScHI8tcR4aRHtRKPs' 

// Inicializamos el cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)