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
  let authorTier = null
  if (user && pathname.startsWith('/admin')) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    role = profile?.role
    if (role !== 'admin') {
      const { data: author } = await supabase.from('authors').select('editorial_role').eq('profile_id', user.id).maybeSingle()
      authorTier = author?.editorial_role
    }
  }
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
  const temporaryExpiry = user?.user_metadata?.temporary_password_expires_at
  if (user?.user_metadata?.password_change_required === true && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const url = request.nextUrl.clone()
    if (temporaryExpiry && new Date(temporaryExpiry) <= new Date()) {
      await supabase.auth.signOut()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'Your temporary password has expired. Ask an administrator for a new one.')
    } else {
      url.pathname = '/account/reset-password'
      url.search = ''
    }
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
  const superOnlyPath = pathname.startsWith('/admin/authors') || pathname.startsWith('/admin/topics')
  const settingsPath = pathname.startsWith('/admin/settings')
  const isSuperAuthor = role === 'admin' || authorTier === 'Super Author'
  const isContributingAuthor = authorTier === 'Contributing Author'
  if (user && superOnlyPath && !isSuperAuthor) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }
  if (user && settingsPath && !isSuperAuthor && !isContributingAuthor) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }
  return response
}
