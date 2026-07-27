import AboutSectionPage, { ForthcomingNotice } from '../../../src/components/AboutSectionPage'
import { getAuthors } from '../../../src/lib/data'

export const metadata = { title: 'Message from the Founder | The Gospel Network' }

export default async function FounderMessagePage() {
  const authors = await getAuthors()
  const founder = authors.find((author) => /\bkwesi\s+sena\b/i.test(author.name))

  return (
    <AboutSectionPage title="Message from the Founder" introduction="A welcome from the founder of The Gospel Network.">
      {founder && (
        <div className="mb-10 grid items-center gap-6 border-y border-midnight-navy/10 py-6 sm:grid-cols-[110px_1fr]">
          {founder.image ? <img src={founder.image} alt={founder.name} className="aspect-square w-[110px] object-cover" /> : <div className="grid size-[110px] place-items-center bg-midnight-navy text-2xl text-white">KS</div>}
          <div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-heritage-gold">Founder</p><h2 className="mt-2 font-display text-3xl text-midnight-navy">{founder.name}</h2></div>
        </div>
      )}
      <ForthcomingNotice item="message from Kwesi Sena" />
    </AboutSectionPage>
  )
}
