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
  let topic = topics.find((item) => item.slug === slug)
  let topicIds = []
  if (topic) {
    topicIds = [topic.id, ...topic.subtopics.flatMap((subtopic) => [subtopic.id, ...subtopic.resources.map((resource) => resource.id)])]
  } else {
    for (const mainTopic of topics) {
      const subtopic = mainTopic.subtopics.find((item) => item.slug === slug)
      if (subtopic) {
        topic = { ...subtopic, subtopics: [subtopic] }
        topicIds = [subtopic.id, ...subtopic.resources.map((resource) => resource.id)]
        break
      }
    }
  }
  if (!topic) notFound()
  return <TopicPage topics={topics} topic={topic} publications={publications.filter((item) => topicIds.includes(item.topicId))} />
}
