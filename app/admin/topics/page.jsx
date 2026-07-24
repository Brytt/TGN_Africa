import TopicManager from '../../../src/components/admin/TopicManager'
import { getTopicTree } from '../../../src/lib/data'

export const metadata = {
  title: 'Topics',
}

export default async function AdminTopicsPage() {
  const topics = await getTopicTree()
  return <TopicManager initialTopics={topics} />
}
