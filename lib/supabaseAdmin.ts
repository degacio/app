import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

console.log("URL:", process.env.EXPO_PUBLIC_SUPABASE_URL)
console.log("SERVICE KEY:", process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 🔥 Não quebrar o Metro se variável não existir
export const supabaseAdmin =
  supabaseUrl && supabaseKey
    ? createClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null