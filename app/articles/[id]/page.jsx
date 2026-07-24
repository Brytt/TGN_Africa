import ArticlePage from '../../../src/views/ArticlePage'
import { notFound } from 'next/navigation'
import { getArticleInteractions, getPublicationBySlug, getPublications } from '../../../src/lib/data'

export const metadata = {
  title: 'Article',
  description: 'Read this article from The Gospel Network Africa.',
}

export default async function Page({ params }) {
  const { id: slug } = await params
  const article = await getPublicationBySlug(slug)
  if (!article) notFound()
  const [all, interactions] = await Promise.all([getPublications({ limit: 4 }), getArticleInteractions(article.id)])
  return <ArticlePage article={article} related={all.filter((item) => item.id !== article.id).slice(0, 3)} initialComments={interactions.comments} userId={interactions.userId} initialLiked={interactions.liked} initialBookmarked={interactions.bookmarked} initialLikeCount={interactions.likeCount} />
}
