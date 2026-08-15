import ActivityManager from '../../../src/components/admin/ActivityManager'
import { getAdminActivity } from '../../../src/lib/data'

export const metadata = { title: 'Admin Activity' }

export default async function AdminActivityPage() {
  return <ActivityManager initialActivity={await getAdminActivity()} />
}
