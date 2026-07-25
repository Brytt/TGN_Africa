import { createClient } from '@supabase/supabase-js'
/* global process, console */

const password = process.argv[2]
const days = Number(process.argv[3] || 7)
if (!password || password.length < 12) throw new Error('Pass a temporary password of at least 12 characters.')
if (!Number.isFinite(days) || days < 1 || days > 14) throw new Error('Expiry must be between 1 and 14 days.')

const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const { data: authors, error } = await admin.from('authors').select('id, name, email, profile_id, editorial_role').eq('status', 'active').order('name')
if (error) throw error

const expiresAt = new Date(Date.now() + days * 86400000).toISOString()
const results = []
for (const author of authors || []) {
  if (/\b(bright|dami|odame)\b/i.test(author.name)) {
    results.push({ email: author.email, status: 'excluded-current-admin' })
    continue
  }
  const metadata = {
    display_name: author.name,
    onboarding_required: false,
    password_change_required: true,
    temporary_password_expires_at: expiresAt,
  }
  let userId = author.profile_id
  if (userId) {
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, { password, user_metadata: metadata })
    if (updateError) throw updateError
  } else {
    const { data, error: createError } = await admin.auth.admin.createUser({
      email: author.email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    })
    if (createError) throw createError
    userId = data.user.id
  }
  const appRole = author.editorial_role === 'Super Author' ? 'admin' : 'author'
  const { error: profileError } = await admin.from('profiles').upsert({ id: userId, display_name: author.name, role: appRole })
  if (profileError) throw profileError
  const { error: linkError } = await admin.from('authors').update({ profile_id: userId }).eq('id', author.id)
  if (linkError) throw linkError
  results.push({ email: author.email, status: 'temporary-login-ready' })
}

console.log(JSON.stringify({ expiresAt, results }, null, 2))
