import AnalyticsManager from '../../../src/components/admin/AnalyticsManager'
import { getAnalyticsEvents, getAuthors, getEditorialTasks, getNewsletterSubscribers, getPublications, getSermonAnalyticsEvents } from '../../../src/lib/data'

export const metadata = {
  title: 'Analytics & Reports',
}

export default async function AdminAnalyticsPage() {
  const [publications, tasks, authors, analyticsEvents, sermonAnalyticsEvents, subscribers] = await Promise.all([
    getPublications({ admin: true }),
    getEditorialTasks(),
    getAuthors({ admin: true }),
    getAnalyticsEvents(),
    getSermonAnalyticsEvents(),
    getNewsletterSubscribers(),
  ])
  return <AnalyticsManager publications={publications} editorialTasks={tasks} authors={authors} analyticsEvents={analyticsEvents} sermonAnalyticsEvents={sermonAnalyticsEvents} subscribers={subscribers} />
}
