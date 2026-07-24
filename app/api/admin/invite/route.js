import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../src/lib/supabase/admin'
import { failure, requireStaff } from '../../../../src/lib/http'

export async function POST(request) {
  const auth = await requireStaff(['admin'])
  if (auth.error) return auth.error
  const { email, role, displayName } = await request.json()
  if (!['admin', 'editor', 'author'].includes(role)) return failure('Invalid staff role')
  const admin = createAdminClient()
  const origin = new URL(request.url).origin
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { display_name: displayName },
    redirectTo: `${origin}/account/reset-password`,
  })
  if (error) return failure(error)
  const { error: profileError } = await admin.from('profiles').upsert({
    id: data.user.id,
    display_name: displayName || email.split('@')[0],
    role,
  })
  if (profileError) return failure(profileError)
  if (['admin', 'editor', 'author'].includes(role)) {
    const name = displayName || email.split('@')[0]
    const { error: authorError } = await admin.from('authors').upsert({
      profile_id: data.user.id,
      slug: `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${data.user.id.slice(0, 8)}`,
      name,
      email,
      editorial_role: role === 'author' ? 'Author' : role === 'editor' ? 'Editor & Author' : 'Administrator & Author',
      status: 'active',
    }, { onConflict: 'email' })
    if (authorError) return failure(authorError)
  }
  return NextResponse.json({ success: true })
}
