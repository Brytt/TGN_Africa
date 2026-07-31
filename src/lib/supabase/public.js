import 'server-only'
import { createClient } from '@supabase/supabase-js'
/* global process */

let publicClient

export function createPublicClient() {
  if (!publicClient) {
    publicClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
  }
  return publicClient
}
