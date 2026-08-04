import ArticlePage from '../../../src/views/ArticlePage'
import { notFound, permanentRedirect } from 'next/navigation'
import { getArticleInteractions, getPublicationBySlug, getRelatedPublications } from '../../../src/lib/data'

function shorten(value = '', limit) {
  const text = String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= limit) return text
  const shortened = text.slice(0, limit - 1).replace(/\s+\S*$/, '').trim()
  return `${shortened}…`
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const article = await getPublicationBySlug(id)
  if (!article) return { title: 'Article' }

  const title = shorten(article.title, 60)
  const description = shorten(article.excerpt || article.subtitle || `Read this article by ${article.author} on The Gospel Network Africa.`, 155)
  const canonicalPath = `/articles/${article.slug}`
  const socialImage = `/api/og/article/${article.slug}`

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    authors: [{ name: article.author }],
    openGraph: {
      type: 'article',
      url: canonicalPath,
      siteName: 'The Gospel Network Africa',
      title,
      description,
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [{ url: socialImage, secureUrl: socialImage, width: 1280, height: 720, type: 'image/jpeg', alt: `Featured image for ${title}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  }
}

export default async function Page({ params }) {
  const { id: slug } = await params
  const article = await getPublicationBySlug(slug)
  if (!article) notFound()
  if (slug !== article.slug) permanentRedirect(`/articles/${article.slug}`)
  const [related, interactions] = await Promise.all([getRelatedPublications(article), getArticleInteractions(article.id)])
  return <ArticlePage article={article} related={related} initialComments={interactions.comments} userId={interactions.userId} initialLiked={interactions.liked} initialBookmarked={interactions.bookmarked} initialLikeCount={interactions.likeCount} />
}
