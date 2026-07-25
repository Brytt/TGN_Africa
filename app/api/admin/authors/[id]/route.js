import { NextResponse } from 'next/server'
import { authorRow } from '../route'
import { failure, requireStaff } from '../../../../../src/lib/http'
import { createAdminClient } from '../../../../../src/lib/supabase/admin'

export async function PATCH(request, { params }) {
  const auth = await requireStaff(['admin'])
  if (auth.error) return auth.error
  const { id } = await params
  const body = await request.json()
  const { error } = await auth.supabase.from('authors').update(authorRow(body)).eq('id', id)
  if (error) return failure(error)
  const { data: author, error: authorError } = await auth.supabase.from('authors').select('profile_id, editorial_role').eq('id', id).maybeSingle()
  if (authorError) return failure(authorError)
  if (author?.profile_id) {
    const nextRole = author.editorial_role === 'Super Author' ? 'admin' : 'author'
    const { error: profileError } = await auth.supabase.from('profiles').update({ role: nextRole }).eq('id', author.profile_id)
    if (profileError) return failure(profileError)
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(_request, { params }) {
  const auth = await requireStaff(['admin'])
  if (auth.error) return auth.error
  const { id } = await params
  const admin = createAdminClient()
  const { data: author, error: authorError } = await admin
    .from('authors')
    .select('id, name, profile_id')
    .eq('id', id)
    .maybeSingle()
  if (authorError) return failure(authorError)
  if (!author) return failure('Author not found.', 404)
  if (author.profile_id === auth.user.id) return failure('You cannot remove your own administrator account.', 409)

  // Keep the contributor details and publication relationships so they can be
  // restored if this email is invited again.
  const { error: archiveError } = await admin
    .from('authors')
    .update({ status: 'inactive', deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (archiveError) return failure(archiveError)

  if (author.profile_id) {
    const { error: authError } = await admin.auth.admin.deleteUser(author.profile_id)
    if (authError) {
      await admin.from('authors').update({ deleted_at: null }).eq('id', id)
      return failure(authError)
    }
  }
  return NextResponse.json({ success: true })
}
