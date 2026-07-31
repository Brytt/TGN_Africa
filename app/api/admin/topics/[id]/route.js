import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../../src/lib/http'

export async function PATCH(request, { params }) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error

  const { id } = await params
  const body = await request.json()
  const title = String(body.title || '').trim()
  if (!title) return NextResponse.json({ error: 'Topic name is required.' }, { status: 400 })

  const { data, error } = await auth.supabase
    .from('topics')
    .update({ title })
    .eq('id', id)
    .select('id, title, slug, level, parent_id')
    .single()

  if (error) return failure(error)
  return NextResponse.json({ data })
}

export async function DELETE(_request, { params }) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error

  const { id } = await params
  const { error } = await auth.supabase.from('topics').delete().eq('id', id)
  if (error) return failure(error)
  return NextResponse.json({ ok: true })
}
