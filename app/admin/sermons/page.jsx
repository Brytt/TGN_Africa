import SermonManager from '../../../src/components/admin/SermonManager'
import { getSermons } from '../../../src/lib/data'

export const metadata = { title: 'Sermons' }

export default async function AdminSermonsPage() {
  return <SermonManager initialSermons={await getSermons({ admin: true })} />
}
