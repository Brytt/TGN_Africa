import 'server-only'
import { createClient } from '@supabase/supabase-js'
/* global process */

export function createAdminClient() {
  if (!process.env.SUPABASE_SECRET_KEY) throw new Error('SUPABASE_SECRET_KEY is not configured')
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
