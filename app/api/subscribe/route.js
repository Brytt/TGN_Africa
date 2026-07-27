import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../src/lib/supabase/admin'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request) {
  const body = await request.json()
  if (body.company) return NextResponse.json({ success: true })
  const email = String(body.email || '').trim().toLowerCase()
  const displayName = String(body.displayName || '').trim().slice(0, 120)
  if (!emailPattern.test(email) || email.length > 254) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  if (body.consent !== true) return NextResponse.json({ error: 'Please confirm that you want to receive new-publication emails.' }, { status: 400 })

  const admin = createAdminClient()
  const { data: existing, error: readError } = await admin.from('newsletter_subscribers').select('id, status').ilike('email', email).maybeSingle()
  if (readError) return NextResponse.json({ error: 'Subscriptions are not available until the newsletter database migration is applied.' }, { status: 503 })
  const result = existing
    ? await admin.from('newsletter_subscribers').update({ display_name: displayName || null, status: 'active', consented_at: new Date().toISOString(), unsubscribed_at: null }).eq('id', existing.id)
    : await admin.from('newsletter_subscribers').insert({ email, display_name: displayName || null, status: 'active', source: 'website' })
  if (result.error) return NextResponse.json({ error: 'Unable to save your subscription right now.' }, { status: 400 })
  return NextResponse.json({ success: true, reactivated: existing?.status === 'unsubscribed' })
}
