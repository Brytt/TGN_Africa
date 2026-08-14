import EmailUpdateManager from '../../../src/components/admin/EmailUpdateManager'
import { getEmailUpdates, getNewsletterSubscribers } from '../../../src/lib/data'

export const metadata = { title: 'Email updates' }

export default async function EmailUpdatesPage() {
  const [updates, subscribers] = await Promise.all([getEmailUpdates(), getNewsletterSubscribers()])
  return <EmailUpdateManager initialUpdates={updates} activeSubscriberCount={subscribers.filter((item) => item.status === 'active').length} />
}
