import SettingsManager from '../../../src/components/admin/SettingsManager'
import { getSettings } from '../../../src/lib/data'

export const metadata = {
  title: 'Settings',
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()
  return <SettingsManager initialValues={settings} />
}
