import SubscriberManager from '../../../src/components/admin/SubscriberManager'
import { getNewsletterSubscribers } from '../../../src/lib/data'

export const metadata = { title: 'Subscribers' }

export default async function SubscribersPage() {
  return <SubscriberManager initialSubscribers={await getNewsletterSubscribers()} />
}
