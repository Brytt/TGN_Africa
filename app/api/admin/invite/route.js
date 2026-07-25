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
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin
  const invitationCallback = new URL('/auth/callback', origin)
  invitationCallback.searchParams.set('next', '/account/reset-password')
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      display_name: displayName,
      invited_role: 'author',
      onboarding_required: true,
    },
    redirectTo: invitationCallback.toString(),
  })
  if (error) return failure(error)
  const { error: profileError } = await admin.from('profiles').upsert({
    id: data.user.id,
    display_name: displayName || email.split('@')[0],
    role,
  })
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id)
    return failure(profileError)
  }
  const name = displayName || email.split('@')[0]
  const { error: authorError } = await admin.from('authors').insert({
    profile_id: data.user.id,
    slug: `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${data.user.id.slice(0, 8)}`,
    name,
    email,
    editorial_role: 'Author',
    status: 'active',
  })
  if (authorError) {
    await admin.auth.admin.deleteUser(data.user.id)
    return failure(authorError)
  }
  return NextResponse.json({ success: true })
}
