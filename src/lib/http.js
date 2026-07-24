import { NextResponse } from 'next/server'
import { createClient } from './supabase/server'

export async function requireStaff(allowed = ['admin', 'editor', 'author']) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) }
  const { data: profile } = await supabase.from('profiles').select('id, role').eq('id', user.id).maybeSingle()
  if (!profile || !allowed.includes(profile.role)) return { error: NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 }) }
  return { supabase, user, profile }
}

export function failure(error, status = 400) {
  return NextResponse.json({ error: error?.message || String(error) }, { status })
}
