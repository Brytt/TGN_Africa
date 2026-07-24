import AdminShell from '../../src/components/admin/AdminShell'
import { getCurrentProfile, getPublications } from '../../src/lib/data'

export const metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | TGN Africa Admin',
  },
  description: 'TGN Africa publishing administration platform.',
}

export default async function AdminLayout({ children }) {
  let publications = []
  let profile = null
  try {
    ;[publications, profile] = await Promise.all([getPublications({ admin: true, limit: 8 }), getCurrentProfile()])
  } catch {
    // Login and database setup screens must remain renderable before seeding.
  }
  return <AdminShell initialSearchResults={publications} profile={profile}>{children}</AdminShell>
}
