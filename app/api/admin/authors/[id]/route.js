import { NextResponse } from 'next/server'
import { authorRow } from '../route'
import { failure, requireStaff } from '../../../../../src/lib/http'

export async function PATCH(request, { params }) {
  const auth = await requireStaff(['admin', 'editor', 'author'])
  if (auth.error) return auth.error
  const { id } = await params
  const body = await request.json()
  const { error } = await auth.supabase.from('authors').update(authorRow(body)).eq('id', id)
  if (error) return failure(error)
  return NextResponse.json({ success: true })
}

export async function DELETE(_request, { params }) {
  const auth = await requireStaff(['admin'])
  if (auth.error) return auth.error
  const { id } = await params
  const { error } = await auth.supabase.from('authors').delete().eq('id', id)
  if (error) return failure(error)
  return NextResponse.json({ success: true })
}
