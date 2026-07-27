import AboutSectionPage from '../../../src/components/AboutSectionPage'

export const metadata = { title: 'Explaining the Logo | The Gospel Network' }

export default function LogoPage() {
  const elements = [
    {
      number: '01',
      title: 'The Latin Cross',
      text: 'The Latin cross stands at the centre of the identity because the crucified and risen Christ stands at the centre of TGN’s work. Its plain, unornamented form directs attention away from novelty and toward the historic substance of the Christian faith. Tertullian, Cyprian, Lactantius, and Augustine—together with the witness of the African martyrs—demonstrate that the cross was confessed, expounded, and borne within Latin North African Christianity centuries before the modern missionary era. It therefore represents both the universality of the gospel and Africa’s ancient participation in the Christian faith.',
    },
    {
      number: '02',
      title: 'The African Continent',
      text: 'Africa appears within the cross rather than merely beside it. The continent is therefore viewed in relation to Christ and His redeeming work. This expresses our desire not simply to distribute Christian information across Africa, but to see people, households, and churches throughout the whole continent brought under the authority of Christ’s Word and increasingly conformed to His image. Africa is prominent, but the cross gives the composition its form: Christ remains the centre, foundation, and goal of the ministry.',
    },
    {
      number: '03',
      title: 'The Gye Nyame Heritage Mark',
      text: 'The Gye Nyame symbol honours the Ghanaian roots from which TGN emerged. Its name means “Except for God,” and it traditionally signifies the supremacy and omnipotence of God. Within the TGN identity, it serves as a heritage and publisher’s mark—a reminder that the ministry’s widening continental vision does not require it to forget where the work began. It also confesses that the platform, its writers, and its future exist beneath the sovereign rule of God.',
    },
    {
      number: '04',
      title: 'The Colour Palette',
      text: 'TGN navy (#0D2240) communicates seriousness, stability, confidence, and permanence. White (#FFFFFF) provides clarity, restraint, and openness. Together, the two colours establish a simple and reproducible identity suitable for both digital and printed publication. Their strong contrast also reinforces the relationship between the cross and Africa, allowing each form to remain immediately visible without unnecessary ornament.',
    },
    {
      number: '05',
      title: 'The Wordmark',
      text: 'The classical serif wordmark gives The Gospel Network the character of an enduring theological publisher rather than a temporary online project. GOSPEL receives the greatest visual prominence because the gospel is the defining message and controlling centre of the platform. NETWORK occupies a supporting position, representing the fellowship of writers, editors, pastors, churches, and readers who labour together in service of that gospel. The restrained spacing communicates dignity, care, and editorial seriousness.',
    },
    {
      number: '06',
      title: 'The Mission Statement',
      text: '“Declaring the Whole Counsel of God for the Saints of Africa” gives verbal expression to the burden represented by the logo. Drawn from Acts 20:26–27, it commits TGN to the breadth of God’s revealed truth rather than to fashionable subjects, narrow doctrinal interests, or merely reactionary commentary. It also identifies the pastoral purpose and intended audience of the work: to instruct, strengthen, protect, and encourage the saints throughout Africa.',
    },
  ]

  return (
    <AboutSectionPage title="Explaining the Logo" introduction="The story and meaning behind the visual identity of The Gospel Network.">
      <div className="grid min-h-[420px] place-items-center bg-[#f3f6fb] p-10 md:p-16">
        <img src="/images/brand/the-gospel-network-logo.jpeg" alt="The Gospel Network logo: a navy Latin cross containing the shape of the African continent" className="w-full max-w-[390px]" />
      </div>

      <div className="mt-14">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heritage-gold">Elements explained</p>
        <h2 className="mt-3 font-display text-4xl text-midnight-navy md:text-5xl">A visual confession.</h2>
        <div className="mt-10">
          {elements.map((element) => (
            <section key={element.number} className="grid gap-5 border-t border-midnight-navy/15 py-8 md:grid-cols-[70px_1fr] md:py-10">
              <span className="text-[11px] font-bold tracking-[0.16em] text-heritage-gold">{element.number}</span>
              <div>
                <h3 className="font-display text-3xl text-midnight-navy">{element.title}</h3>
                <p className="mt-4 text-base leading-8 text-midnight-navy/65">{element.text}</p>
                {element.number === '03' && (
                  <div className="mt-7 flex items-center gap-5 bg-[#f3f6fb] p-5">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-white" aria-hidden="true">
                      <img src="/images/brand/gye-nyame-reference.jpeg" alt="" className="absolute left-1/2 top-1/2 w-[180px] max-w-none -translate-x-1/2 -translate-y-[40.5%]" />
                    </div>
                    <div><p className="font-display text-2xl text-midnight-navy">Gye Nyame</p><p className="mt-1 text-sm text-midnight-navy/50">Except for God</p></div>
                  </div>
                )}
                {element.number === '04' && (
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="bg-midnight-navy p-5 text-white"><span className="text-[10px] font-bold uppercase tracking-[0.15em]">TGN Navy</span><span className="mt-7 block text-xs text-white/55">#0D2240</span></div>
                    <div className="border border-midnight-navy/15 bg-white p-5 text-midnight-navy"><span className="text-[10px] font-bold uppercase tracking-[0.15em]">White</span><span className="mt-7 block text-xs text-midnight-navy/45">#FFFFFF</span></div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AboutSectionPage>
  )
}
