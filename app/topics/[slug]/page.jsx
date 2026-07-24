import TopicPage from '../../../src/views/TopicPage'
import { topicBank, topicBySlug } from '../../../src/data/topicBank.generated'

export function generateStaticParams() {
  return topicBank.map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const topic = topicBySlug[slug]

  return {
    title: topic?.title || 'Topic',
    description: topic
      ? `Explore ${topic.title} through the TGN Africa theological resource library.`
      : 'Explore the TGN Africa topic library.',
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  return <TopicPage topicSlug={slug} />
}
