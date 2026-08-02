import ArticlePage from '../../../src/views/ArticlePage'
import { notFound } from 'next/navigation'
import { getArticleInteractions, getPublicationBySlug, getRelatedPublications } from '../../../src/lib/data'

function shorten(value = '', limit) {
  const text = String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= limit) return text
  const shortened = text.slice(0, limit - 1).replace(/\s+\S*$/, '').trim()
  return `${shortened}…`
}

export async function generateMetadata({ params }) {
  const article = await getPublicationBySlug((await params).id)
  if (!article) return { title: 'Article' }

  const title = shorten(article.title, 60)
  const description = shorten(article.excerpt || article.subtitle || `An article by ${article.author}.`, 120)

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      images: [{ url: article.image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.image],
    },
  }
}

export default async function Page({ params }) {
  const { id: slug } = await params
  const article = await getPublicationBySlug(slug)
  if (!article) notFound()
  const [related, interactions] = await Promise.all([getRelatedPublications(article), getArticleInteractions(article.id)])
  return <ArticlePage article={article} related={related} initialComments={interactions.comments} userId={interactions.userId} initialLiked={interactions.liked} initialBookmarked={interactions.bookmarked} initialLikeCount={interactions.likeCount} />
}
