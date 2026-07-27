import AboutSectionPage, { ForthcomingNotice } from '../../../src/components/AboutSectionPage'

export const metadata = { title: 'Vision Statement | The Gospel Network' }

export default function VisionPage() {
  return (
    <AboutSectionPage title="Vision Statement" introduction="Our long-term vision for serving the African church.">
      <ForthcomingNotice item="vision statement" />
    </AboutSectionPage>
  )
}
