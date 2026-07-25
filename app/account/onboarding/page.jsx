import { redirect } from 'next/navigation'
import { createClient } from '../../../src/lib/supabase/server'
import { getCurrentAuthor, getCurrentProfile } from '../../../src/lib/data'
import AccountSettings from '../../../src/components/admin/AccountSettings'

export const metadata = { title: 'Complete Staff Profile' }

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login?error=Open the invitation link to continue.')
  const [profile, author] = await Promise.all([getCurrentProfile(), getCurrentAuthor()])
  if (!profile || !['admin', 'editor', 'author'].includes(profile.role)) redirect('/account')
  if (user.user_metadata?.onboarding_required !== true) redirect('/admin')
  return <AccountSettings onboarding initialProfile={author || { displayName: profile.display_name }} email={user.email || ''} />
}
