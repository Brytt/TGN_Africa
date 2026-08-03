import AuthorManager from '../../../src/components/admin/AuthorManager'
import { getAuthors, getCurrentAuthor } from '../../../src/lib/data'

export const metadata = {
  title: 'Authors',
}

export default async function AdminAuthorsPage() {
  const [authors, currentAuthor] = await Promise.all([getAuthors({ admin: true }), getCurrentAuthor()])
  const canEditProfiles = ['Founder', 'Managing Editor', 'Deputy Editor'].includes(currentAuthor?.role)
  return <AuthorManager initialAuthors={authors} canManageAccess={currentAuthor?.role === 'Founder'} canEditProfiles={canEditProfiles} />
}
