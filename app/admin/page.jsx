import AnalyticsManager from '../../src/components/admin/AnalyticsManager'
import { getAnalyticsEvents, getAuthors, getEditorialTasks, getNewsletterSubscribers, getPublications } from '../../src/lib/data'

export default async function AdminPage() {
  const [publications, tasks, authors, analyticsEvents, subscribers] = await Promise.all([
    getPublications({ admin: true }),
    getEditorialTasks(),
    getAuthors({ admin: true }),
    getAnalyticsEvents(),
    getNewsletterSubscribers(),
  ])
  return <AnalyticsManager publications={publications} editorialTasks={tasks} authors={authors} analyticsEvents={analyticsEvents} subscribers={subscribers} />
}
