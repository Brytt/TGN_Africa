import AdminShell from '../../src/components/admin/AdminShell'
import { getCurrentProfile } from '../../src/lib/data'

export const metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | TGN Africa Admin',
  },
  description: 'TGN Africa publishing administration platform.',
}

export default async function AdminLayout({ children }) {
  let profile = null
  try {
    profile = await getCurrentProfile()
  } catch {
    // Login and database setup screens must remain renderable before seeding.
  }
  return <AdminShell profile={profile}>{children}</AdminShell>
}
