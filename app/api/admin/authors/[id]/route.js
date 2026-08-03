import { NextResponse } from 'next/server'
import { authorRow } from '../route'
import { failure, requireStaff } from '../../../../../src/lib/http'
import { createAdminClient } from '../../../../../src/lib/supabase/admin'

export async function PATCH(request, { params }) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error
  const { id } = await params
  const body = await request.json()
  const { data: actingAuthor } = await auth.supabase.from('authors').select('editorial_role').eq('profile_id', auth.user.id).maybeSingle()
  if (body.action === 'changeRole') {
    if (actingAuthor?.editorial_role !== 'Founder') return failure('Only the Founder can change staff roles.', 403)
    if (!['Founder', 'Managing Editor', 'Deputy Editor', 'Contributor', 'Guest Author'].includes(body.role)) return failure('Invalid author role.')
    const { data: author, error } = await auth.supabase
      .from('authors')
      .update({ editorial_role: body.role, is_staff: body.role !== 'Guest Author' })
      .eq('id', id)
      .select('profile_id')
      .maybeSingle()
    if (error) return failure(error)
    if (!author) return failure('Author not found.', 404)
    if (author.profile_id) {
      const { error: profileError } = await auth.supabase
        .from('profiles')
        .update({ role: body.role === 'Founder' ? 'admin' : ['Managing Editor', 'Deputy Editor'].includes(body.role) ? 'editor' : 'author' })
        .eq('id', author.profile_id)
      if (profileError) return failure(profileError)
    }
    return NextResponse.json({ success: true })
  }
  if (body.action === 'changeAccess') {
    if (actingAuthor?.editorial_role !== 'Founder') return failure('Only the Founder can grant menu access.', 403)
    const allowed = ['analytics', 'content', 'comments', 'authors', 'subscribers', 'topics']
    const menuAccess = [...new Set(Array.isArray(body.menuAccess) ? body.menuAccess : [])].filter((item) => allowed.includes(item))
    const { error } = await auth.supabase.from('authors').update({ admin_menu_access: menuAccess }).eq('id', id).eq('is_staff', true)
    if (error) return failure(error)
    return NextResponse.json({ success: true })
  }
  if (!['Founder', 'Managing Editor', 'Deputy Editor'].includes(actingAuthor?.editorial_role)) {
    return failure('Only the Founder, Managing Editor, or Deputy Editor can edit contributor profiles.', 403)
  }
  const { error } = await auth.supabase.from('authors').update(authorRow(body)).eq('id', id)
  if (error) return failure(error)
  const { data: author, error: authorError } = await auth.supabase.from('authors').select('profile_id, editorial_role').eq('id', id).maybeSingle()
  if (authorError) return failure(authorError)
  if (author?.profile_id) {
    const nextRole = author.editorial_role === 'Founder' ? 'admin' : ['Managing Editor', 'Deputy Editor'].includes(author.editorial_role) ? 'editor' : 'author'
    const { error: profileError } = await auth.supabase.from('profiles').update({ role: nextRole }).eq('id', author.profile_id)
    if (profileError) return failure(profileError)
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(_request, { params }) {
  const auth = await requireStaff(['admin', 'editor'])
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

  if (author.profile_id) {
    const { error: authError } = await admin.auth.admin.deleteUser(author.profile_id)
    if (authError) return failure(authError)
  }

  const { error: deleteError } = await admin.from('authors').delete().eq('id', id)
  if (deleteError) return failure(deleteError)
  return NextResponse.json({ success: true })
}
