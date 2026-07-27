import AboutSectionPage, { ForthcomingNotice } from '../../../src/components/AboutSectionPage'

export const metadata = { title: 'Statement of Faith | The Gospel Network' }

export default function StatementOfFaithPage() {
  return (
    <AboutSectionPage title="Statement of Faith" introduction="The biblical convictions that shape our teaching and publishing.">
      <ForthcomingNotice item="statement of faith" />
    </AboutSectionPage>
  )
}
