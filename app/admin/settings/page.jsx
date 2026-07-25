import SettingsManager from '../../../src/components/admin/SettingsManager'
import { getCurrentAuthor, getCurrentProfile, getSettings } from '../../../src/lib/data'

export const metadata = {
  title: 'Settings',
}

export default async function AdminSettingsPage() {
  const [settings, profile, author] = await Promise.all([getSettings(), getCurrentProfile(), getCurrentAuthor()])
  const fullAccess = profile?.role === 'admin' || author?.role === 'Super Author'
  return <SettingsManager initialValues={settings} limited={!fullAccess} />
}
