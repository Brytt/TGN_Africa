import { updateSession } from './src/lib/supabase/middleware'

export async function proxy(request) {
  return updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/auth/:path*'],
}
