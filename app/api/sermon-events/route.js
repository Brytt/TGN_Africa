import { createHash, randomUUID } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '../../../src/lib/supabase/server'
/* global process */

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { sermonId, eventType } = await request.json()
  if (!['page_view', 'listen', 'watch'].includes(eventType)) return NextResponse.json({ error: 'Invalid event.' }, { status: 400 })
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(sermonId || ''))) return NextResponse.json({ error: 'Invalid sermon.' }, { status: 400 })

  const cookieStore = await cookies()
  let sessionId = cookieStore.get('tgn_analytics_session')?.value
  if (!sessionId) sessionId = randomUUID()
  const sessionHash = createHash('sha256').update(`${sessionId}:${process.env.SUPABASE_SECRET_KEY}`).digest('hex')
  const referrer = (await headers()).get('referer')
  let referrerHost = null
  try { referrerHost = referrer ? new URL(referrer).hostname : null } catch { referrerHost = null }

  const { error } = await supabase.from('sermon_analytics_events').insert({
    sermon_id: sermonId,
    user_id: user?.id || null,
    event_type: eventType,
    anonymous_session_hash: sessionHash,
    referrer_host: referrerHost,
  })
  if (error) return NextResponse.json({ error: 'Unable to record this sermon event.' }, { status: 400 })
  const response = NextResponse.json({ success: true })
  response.cookies.set('tgn_analytics_session', sessionId, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 365 })
  return response
}
