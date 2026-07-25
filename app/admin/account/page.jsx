import { createClient } from '../../../src/lib/supabase/server'
import { getCurrentAuthor, getCurrentProfile } from '../../../src/lib/data'
import AccountSettings from '../../../src/components/admin/AccountSettings'

export const metadata = { title: 'My Account' }

export default async function AdminAccountPage() {
  const supabase = await createClient()
  const [{ data: { user } }, profile, author] = await Promise.all([
    supabase.auth.getUser(),
    getCurrentProfile(),
    getCurrentAuthor(),
  ])
  return <AccountSettings initialProfile={author || { displayName: profile?.display_name }} email={user?.email || ''} />
}
