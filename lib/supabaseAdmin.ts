import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'



export const supabaseAdmin = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

console.log("URL:", process.env.EXPO_PUBLIC_SUPABASE_URL)
console.log("KEY:", process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)