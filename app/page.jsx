import AfricanVoices from '../src/components/AfricanVoices'
import AnnouncementBar from '../src/components/AnnouncementBar'
import Footer from '../src/components/Footer'
import Hero from '../src/components/Hero'
import LatestPublications from '../src/components/LatestPublications'
import Mission from '../src/components/Mission'
import Navbar from '../src/components/Navbar'
import ResourceGateway from '../src/components/ResourceGateway'
import VisionMission from '../src/components/VisionMission'
import { getAuthors, getPublications } from '../src/lib/data'

export default async function HomePage() {
  const [publications, authors] = await Promise.all([getPublications({ summary: true }), getAuthors()])
  return (
    <div className="min-h-screen overflow-x-hidden bg-parchment-ivory text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <LatestPublications publications={publications} />
        <Mission />
        <VisionMission />
        <ResourceGateway />
        <AfricanVoices contributors={authors} />
      </main>
      <Footer />
    </div>
  )
}
