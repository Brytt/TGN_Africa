import { NextResponse } from 'next/server'
import { createClient } from './supabase/server'

export async function requireStaff(allowed = ['admin', 'editor', 'author']) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    // A stale token (or a token issued by a different Supabase project) must not
    // keep being submitted on every admin request.
    if (error) {
      try {
        await supabase.auth.signOut({ scope: 'local' })
      } catch {
        // The response below still tells the browser to begin a clean login.
      }
    }
    return {
      error: NextResponse.json({
        error: error
          ? 'Your admin session is invalid or has expired. Please sign in again.'
          : 'Authentication required',
        code: 'INVALID_SESSION',
      }, { status: 401 }),
    }
  }
  const { data: profile } = await supabase.from('profiles').select('id, role').eq('id', user.id).maybeSingle()
  if (!profile || !allowed.includes(profile.role)) return { error: NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 }) }
  return { supabase, user, profile }
}

export function failure(error, status = 400) {
  return NextResponse.json({ error: error?.message || String(error) }, { status })
}
