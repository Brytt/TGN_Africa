import AnnouncementBar from '../src/components/AnnouncementBar'
import Footer from '../src/components/Footer'
import Hero from '../src/components/Hero'
import LatestPublications from '../src/components/LatestPublications'
import Mission from '../src/components/Mission'
import Navbar from '../src/components/Navbar'
import ResourceGateway from '../src/components/ResourceGateway'
import { getPublications } from '../src/lib/data'

export const revalidate = 60

export default async function HomePage() {
  const publications = await getPublications({ summary: true })
  return (
    <div className="min-h-screen overflow-x-hidden bg-parchment-ivory text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <LatestPublications publications={publications} />
        <Mission />
        <ResourceGateway publications={publications} />
      </main>
      <Footer />
    </div>
  )
}
