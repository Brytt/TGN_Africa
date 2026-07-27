import AboutSectionPage, { ForthcomingNotice } from '../../../src/components/AboutSectionPage'

export const metadata = { title: 'Explaining the Logo | The Gospel Network' }

export default function LogoPage() {
  return (
    <AboutSectionPage title="Explaining the Logo" introduction="The story and meaning behind the visual identity of The Gospel Network.">
      <div className="mb-10 grid min-h-[360px] place-items-center border border-midnight-navy/10 bg-white p-10">
        <img src="/images/brand/the-gospel-network-logo.jpeg" alt="The Gospel Network logo: a blue cross containing the shape of Africa" className="w-full max-w-[350px]" />
      </div>
      <ForthcomingNotice item="official explanation of the logo" />
    </AboutSectionPage>
  )
}
