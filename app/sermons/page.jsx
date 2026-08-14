import Navbar from '../../src/components/Navbar'
import Footer from '../../src/components/Footer'
import SermonsPage from '../../src/views/SermonsPage'
import { getSermons } from '../../src/lib/data'

export const revalidate = 60
export const metadata = { title: 'Sermons', description: 'Watch and listen to biblical sermons from The Gospel Network Africa.' }

export default async function Page() {
  return <><Navbar /><SermonsPage sermons={await getSermons()} /><Footer /></>
}
