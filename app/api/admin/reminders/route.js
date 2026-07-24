import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'

const reminderKey = 'author-birthdays'

export async function GET() {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const { data, error } = await auth.supabase.from('reminder_dismissals')
    .select('reminder_key')
    .eq('user_id', auth.user.id)
    .eq('reminder_key', reminderKey)
    .eq('dismissed_on', new Date().toISOString().slice(0, 10))
    .maybeSingle()
  if (error) return failure(error)
  return NextResponse.json({ dismissed: Boolean(data) })
}

export async function POST() {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const { error } = await auth.supabase.from('reminder_dismissals').upsert({
    user_id: auth.user.id,
    reminder_key: reminderKey,
    dismissed_on: new Date().toISOString().slice(0, 10),
  })
  if (error) return failure(error)
  return NextResponse.json({ success: true })
}
