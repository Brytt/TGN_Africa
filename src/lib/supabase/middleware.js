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
  let menuAccess = []
  if (user && pathname.startsWith('/admin')) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    role = profile?.role
    const { data: author } = await supabase.from('authors').select('editorial_role, admin_menu_access').eq('profile_id', user.id).maybeSingle()
    authorTier = author?.editorial_role
    menuAccess = author?.admin_menu_access || []
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
  const isFounder = authorTier === 'Founder'
  const seniorStaff = ['Founder', 'Managing Editor', 'Deputy Editor'].includes(authorTier)
  const contributor = authorTier === 'Contributor'
  const baseline = seniorStaff
    ? ['analytics', 'content', 'comments', 'authors', 'subscribers', 'topics']
    : contributor
      ? ['analytics', 'content', 'comments']
      : ['content']
  if (isFounder) baseline.push('settings')
  const permissions = new Set([...baseline, ...menuAccess])
  const protectedMenus = [
    ['/admin/settings', 'settings'],
    ['/admin/subscribers', 'subscribers'],
    ['/admin/authors', 'authors'],
    ['/admin/topics', 'topics'],
    ['/admin/comments', 'comments'],
    ['/admin/content', 'content'],
  ]
  const requiredPermission = protectedMenus.find(([prefix]) => pathname.startsWith(prefix))?.[1]
    || (pathname === '/admin' ? 'analytics' : null)
  if (user && requiredPermission && !permissions.has(requiredPermission)) {
    const url = request.nextUrl.clone()
    url.pathname = permissions.has('analytics') ? '/admin' : permissions.has('content') ? '/admin/content' : '/admin/account'
    return NextResponse.redirect(url)
  }
  return response
}
