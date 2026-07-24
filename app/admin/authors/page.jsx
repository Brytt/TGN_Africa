import AuthorManager from '../../../src/components/admin/AuthorManager'
import { getAuthors } from '../../../src/lib/data'

export const metadata = {
  title: 'Authors',
}

export default async function AdminAuthorsPage() {
  const authors = await getAuthors({ admin: true })
  return <AuthorManager initialAuthors={authors} />
}
