import { Suspense } from 'react'
import ContentManager from '../../../src/components/admin/ContentManager'

export const metadata = {
  title: 'Content',
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-slate-400">Loading content library...</div>}>
      <ContentManager />
    </Suspense>
  )
}
