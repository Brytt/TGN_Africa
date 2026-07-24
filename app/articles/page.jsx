import ArticlesPage from '../../src/views/ArticlesPage'
import { getAuthors, getPublications, getTopicTree } from '../../src/lib/data'

export const metadata = {
  title: 'Articles',
  description: 'Read recent biblical and theological articles from The Gospel Network Africa.',
}

export default async function Page() {
  const [articles, authors, topics] = await Promise.all([getPublications(), getAuthors(), getTopicTree()])
  return <ArticlesPage articles={articles} authors={authors} topics={topics} />
}
