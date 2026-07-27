import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../src/lib/supabase/admin'

export async function GET(request) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/subscribe?error=Invalid unsubscribe link.', request.url))
  const admin = createAdminClient()
  const { error } = await admin.from('newsletter_subscribers').update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() }).eq('unsubscribe_token', token)
  return NextResponse.redirect(new URL(error ? '/subscribe?error=Unable to unsubscribe.' : '/subscribe?unsubscribed=true', request.url))
}
