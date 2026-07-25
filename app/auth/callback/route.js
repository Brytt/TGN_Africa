import { NextResponse } from 'next/server'
import { createClient } from '../../../src/lib/supabase/server'

export async function GET(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next')
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, request.url))
  }
  const destination = next?.startsWith('/') && !next.startsWith('//') ? next : '/account'
  return NextResponse.redirect(new URL(destination, request.url))
}
