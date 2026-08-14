import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'
import { sendSubscriberUpdate } from '../../../../src/lib/newsletter'

export async function POST(request) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error
  const body = await request.json()
  const subject = body.subject?.trim()
  const message = body.message?.trim()
  if (!subject || !message) return failure('Subject and message are required.')
  if (subject.length > 160) return failure('Keep the subject under 160 characters.')
  const result = await sendSubscriberUpdate({ subject, preheader: body.preheader?.trim(), message })
  if (result.skipped) return failure('Email delivery is not configured on this server.', 503)
  const { error } = await auth.supabase.from('email_updates').insert({
    subject, preheader: body.preheader?.trim() || null, message,
    recipient_count: result.sent, failed_count: result.failed, sent_by: auth.user.id,
  })
  if (error) return failure(error)
  return NextResponse.json({ data: result })
}
