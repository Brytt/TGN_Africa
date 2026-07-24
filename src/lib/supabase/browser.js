'use client'
/* global process */

import { createBrowserClient } from '@supabase/ssr'

let client

export function createClient() {
  client ??= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  )
  return client
}
