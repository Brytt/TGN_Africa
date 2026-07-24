import AnalyticsManager from '../../../src/components/admin/AnalyticsManager'
import { getAnalyticsEvents, getAuthors, getEditorialTasks, getPublications } from '../../../src/lib/data'

export const metadata = {
  title: 'Analytics & Reports',
}

export default async function AdminAnalyticsPage() {
  const [publications, tasks, authors, analyticsEvents] = await Promise.all([
    getPublications({ admin: true }),
    getEditorialTasks(),
    getAuthors({ admin: true }),
    getAnalyticsEvents(),
  ])
  return <AnalyticsManager publications={publications} editorialTasks={tasks} authors={authors} analyticsEvents={analyticsEvents} />
}
