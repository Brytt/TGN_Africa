import { notFound, permanentRedirect } from 'next/navigation'
import { getPublicationBySlug } from '../../src/lib/data'

export default async function LegacyPublicationPage({ params }) {
  const { legacySlug } = await params
  const publication = await getPublicationBySlug(legacySlug)
  if (publication) permanentRedirect(`/articles/${publication.slug}`)
  notFound()
}
