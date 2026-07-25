import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
/* global process */

export async function updateSession(request) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  let role = null
  if (user && pathname.startsWith('/admin')) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    role = profile?.role
  }
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && user?.user_metadata?.onboarding_required === true) {
    const url = request.nextUrl.clone()
    url.pathname = '/account/onboarding'
    url.search = ''
    return NextResponse.redirect(url)
  }
  if (pathname === '/admin/login' && user) {
    const url = request.nextUrl.clone()
    url.pathname = ['admin', 'editor', 'author'].includes(role) ? '/admin' : '/'
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && user && !['admin', 'editor', 'author'].includes(role)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  return response
}
