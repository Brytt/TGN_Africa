import TopicPage from '../../src/views/TopicPage'
import { getTopicTree } from '../../src/lib/data'

export const revalidate = 60

export const metadata = {
  title: 'Topics',
  description: 'Explore the TGN Africa library by biblical, theological, pastoral, and cultural topic.',
}

export default async function Page() {
  const topics = await getTopicTree()
  return <TopicPage topics={topics} />
}
