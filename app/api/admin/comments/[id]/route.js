import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../../src/lib/http'

export async function PATCH(request, { params }) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error
  const { id } = await params
  const { status } = await request.json()
  if (!['approved', 'rejected', 'hidden'].includes(status)) return failure('Invalid moderation status')
  const { error } = await auth.supabase.from('comments').update({
    status,
    moderated_by: auth.user.id,
    moderated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) return failure(error)
  return NextResponse.json({ success: true })
}
