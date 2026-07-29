import SettingsManager from '../../../src/components/admin/SettingsManager'
import { getCurrentAuthor, getSettings } from '../../../src/lib/data'

export const metadata = {
  title: 'Settings',
}

export default async function AdminSettingsPage() {
  const [settings, author] = await Promise.all([getSettings(), getCurrentAuthor()])
  const fullAccess = author?.role === 'Founder'
  return <SettingsManager initialValues={settings} limited={!fullAccess} />
}
