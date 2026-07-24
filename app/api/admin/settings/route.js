import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'

export async function PUT(request) {
  const auth = await requireStaff(['admin'])
  if (auth.error) return auth.error
  const settings = await request.json()
  const rows = Object.entries(settings).map(([key, value]) => ({ key, value, updated_by: auth.user.id }))
  const { error } = await auth.supabase.from('site_settings').upsert(rows)
  if (error) return failure(error)
  return NextResponse.json({ success: true })
}
