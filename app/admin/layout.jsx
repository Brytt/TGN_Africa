import AdminShell from '../../src/components/admin/AdminShell'
import { getCurrentAuthor, getCurrentProfile } from '../../src/lib/data'

export const metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | TGN Africa Admin',
  },
  description: 'TGN Africa publishing administration platform.',
}

export default async function AdminLayout({ children }) {
  let profile = null
  let currentAuthor = null
  try {
    ;[profile, currentAuthor] = await Promise.all([getCurrentProfile(), getCurrentAuthor()])
  } catch {
    // Login and database setup screens must remain renderable before seeding.
  }
  return <AdminShell profile={profile} authorTier={currentAuthor?.role || 'Guest Author'} menuAccess={currentAuthor?.menuAccess || []} dateOfBirth={currentAuthor?.dateOfBirth}>{children}</AdminShell>
}
