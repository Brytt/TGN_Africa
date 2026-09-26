import AboutSectionPage from '../../../src/components/AboutSectionPage'
import { getAuthors } from '../../../src/lib/data'

export const revalidate = 60

export const metadata = { title: 'Message from the Founder | The Gospel Network' }

export default async function FounderMessagePage() {
  const authors = await getAuthors()
  const founder = authors.find((author) => /\bkwesi\s+sena\b/i.test(author.name))

  return (
    <AboutSectionPage title="Message from the Founder" introduction="A welcome from the founder of The Gospel Network.">
      {founder && (
        <div className="mb-10 grid items-center gap-6 border-y border-midnight-navy/10 py-6 sm:grid-cols-[110px_1fr]">
          {founder.image ? <img src={founder.image} alt={founder.name} className="aspect-square w-[110px] object-cover" /> : <div className="grid size-[110px] place-items-center bg-midnight-navy text-2xl text-white">KS</div>}
          <div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-heritage-gold">Founder</p><h2 className="tgn-display-heading mt-2 text-3xl text-midnight-navy">{founder.name}</h2></div>
        </div>
      )}
      <article className="tgn-statement-copy space-y-7 text-[17px] leading-8 md:text-[19px] md:leading-9">
        <blockquote className="border-l-4 border-heritage-gold py-2 pl-6 font-display text-2xl italic leading-9 text-midnight-navy md:pl-9 md:text-3xl md:leading-10">
          <p>“For I delivered to you as of first importance what I also received: that Christ died for our sins in accordance with the Scriptures, that He was buried, that He was raised on the third day in accordance with the Scriptures.”</p>
          <p className="mt-4 font-sans text-base not-italic leading-7">(1 Corinthians 15:3–4)</p>
        </blockquote>
        <p>There is one gospel regardless of the context within which it is proclaimed. Paul, the apostle to the Gentiles, could have changed the message to suit the particular needs of the Gentile population to which he had been called. Yet in his letter to the saints in Corinth, he reminded them that he delivered only that which he also received. There is only one gospel, and whenever it has been faithfully proclaimed, God has been pleased to call sinners to Himself.</p>
        <p>Unfortunately, across Africa there is an alternative gospel that has gained ground, a message that teaches that God exists to supply our material needs. This is far from the message that Paul received and faithfully delivered. An argument that is often made is that the African context is different; therefore, the gospel must be tailored to the needs of Africans. While we do not dispute that there are different contexts, The Gospel Network (TGN) exists to make the point that though the context may be different, the message must be the same.</p>
        <p>Regardless of economic circumstances, the greatest need of all humanity is reconciliation with God through salvation from sin and the wrath to come. It was for this reason that the Son of God was manifested: He “came to seek and to save the lost.” While the gospel compels compassion for the hungry, the sick, and the suffering, the gospel itself is the good news that Christ saves sinners through His death and resurrection. It remains the answer to our greatest predicament: our guilt before God and our need for redemption in Christ.</p>
        <p>Therefore, while TGN writes from a distinctively African perspective, our sole aim is to affirm that even in the context of Africa, we must hold to the same message that has been passed on since the dawn of Christianity: that Christ died for our sins in accordance with the Scriptures.</p>
        <p>My prayer is that our resources will be a blessing to you and help you enjoy a deeper relationship with God.</p>
        <footer className="border-t border-midnight-navy/15 pt-7">
          <p>Blessings,</p>
          <p className="tgn-display-heading mt-2 text-2xl text-midnight-navy">Kwesi Sena</p>
        </footer>
      </article>
    </AboutSectionPage>
  )
}
