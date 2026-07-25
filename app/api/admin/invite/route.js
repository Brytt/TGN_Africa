import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../src/lib/supabase/admin'
import { failure, requireStaff } from '../../../../src/lib/http'
/* global process */

export async function POST(request) {
  const auth = await requireStaff(['admin'])
  if (auth.error) return auth.error
  const body = await request.json()
  const email = String(body.email || '').trim().toLowerCase()
  const displayName = String(body.displayName || '').trim()
  if (!email || !email.includes('@') || !displayName) return failure('A valid name and email address are required.')
  const role = 'author'
  const admin = createAdminClient()
  const { data: previousAuthor, error: previousAuthorError } = await admin
    .from('authors')
    .select('id, name, phone, date_of_birth, qualification, church, denomination, city, country, bio, expertise, website, avatar_path')
    .eq('email', email)
    .maybeSingle()
  if (previousAuthorError) return failure(previousAuthorError)

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      display_name: previousAuthor?.name || displayName,
      invited_role: 'author',
      onboarding_required: true,
      returning_author: Boolean(previousAuthor),
    },
    redirectTo: new URL('/account/reset-password', origin).toString(),
  })
  if (error) return failure(error)
  const { error: profileError } = await admin.from('profiles').upsert({
    id: data.user.id,
    display_name: displayName || email.split('@')[0],
    role,
  })
  if (profileError) return failure(profileError)
  const name = previousAuthor?.name || displayName || email.split('@')[0]
  const authorWrite = previousAuthor
    ? admin.from('authors').update({
        profile_id: data.user.id,
        name,
        editorial_role: 'Author',
        status: 'active',
        deleted_at: null,
      }).eq('id', previousAuthor.id)
    : admin.from('authors').insert({
        profile_id: data.user.id,
        slug: `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${data.user.id.slice(0, 8)}`,
        name,
        email,
        editorial_role: 'Author',
        status: 'active',
      })
  const { error: authorError } = await authorWrite
  if (authorError) return failure(authorError)
  return NextResponse.json({ success: true, restored: Boolean(previousAuthor) })
}
