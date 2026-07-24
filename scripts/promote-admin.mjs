import process from 'node:process'
import { createClient } from '@supabase/supabase-js'
/* global console */

process.loadEnvFile?.('.env.local')
const email = process.argv[2]
if (!email) throw new Error('Usage: npm run supabase:promote-admin -- admin@example.com')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
if (usersError) throw usersError
const user = users.users.find((item) => item.email?.toLowerCase() === email.toLowerCase())
if (!user) throw new Error(`No Supabase Auth user found for ${email}`)
const { error } = await supabase.from('profiles').upsert({
  id: user.id,
  display_name: user.user_metadata?.display_name || email.split('@')[0],
  role: 'admin',
})
if (error) throw error
const displayName = user.user_metadata?.display_name || email.split('@')[0]
const slug = displayName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const { error: authorError } = await supabase.from('authors').upsert({
  profile_id: user.id,
  slug,
  name: displayName,
  email,
  editorial_role: 'Administrator & Author',
  status: 'active',
}, { onConflict: 'email' })
if (authorError) throw authorError
console.log(`Promoted ${email} to admin`)
