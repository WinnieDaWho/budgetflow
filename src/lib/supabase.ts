import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Log environment variable status (without exposing secrets)
if (import.meta.env.DEV) {
  console.log('[BudgetFlow] Supabase config:', {
    urlPresent: !!supabaseUrl,
    keyPresent: !!supabaseAnonKey,
    urlLength: supabaseUrl.length,
    keyLength: supabaseAnonKey.length,
  })
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[BudgetFlow] Missing Supabase environment variables. Please check your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Transaction = {
  id: string
  user_id: string
  amount: number
  type: 'credit' | 'debit'
  category: string | null
  description: string | null
  date: string
  created_at: string
}

