import { Suspense } from 'react'
import ContentManager from '../../../src/components/admin/ContentManager'
import { getCurrentAuthor, getPublications, getTopicTree } from '../../../src/lib/data'

export const metadata = {
  title: 'Content',
}

export default async function AdminContentPage() {
  const [publications, topics, currentAuthor] = await Promise.all([
    getPublications({ admin: true }),
    getTopicTree(),
    getCurrentAuthor(),
  ])
  return (
    <Suspense fallback={<div className="p-10 text-sm text-slate-400">Loading content library...</div>}>
      <ContentManager initialPublications={publications} topics={topics} currentAuthor={currentAuthor} />
    </Suspense>
  )
}
