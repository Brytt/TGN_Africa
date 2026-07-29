import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'

export async function PUT(request) {
  const auth = await requireStaff(['admin'])
  if (auth.error) return auth.error
  const { data: founder } = await auth.supabase.from('authors').select('editorial_role').eq('profile_id', auth.user.id).maybeSingle()
  if (founder?.editorial_role !== 'Founder') return failure('Only the Founder can change general settings.', 403)
  const settings = await request.json()
  const rows = Object.entries(settings).map(([key, value]) => ({ key, value, updated_by: auth.user.id }))
  const { error } = await auth.supabase.from('site_settings').upsert(rows)
  if (error) return failure(error)
  return NextResponse.json({ success: true })
}
