import TopicPage from '../../../src/views/TopicPage'
import { notFound } from 'next/navigation'
import { getPublications, getTopicTree } from '../../../src/lib/data'

export async function generateMetadata({ params }) {
  const { slug } = await params
  return {
    title: slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
    description: 'Explore this subject through the TGN Africa theological resource library.',
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const [topics, publications] = await Promise.all([getTopicTree(), getPublications()])
  const topic = topics.find((item) => item.slug === slug)
  if (!topic) notFound()
  return <TopicPage topics={topics} topic={topic} publications={publications.filter((item) => item.topicId === topic.id)} />
}
