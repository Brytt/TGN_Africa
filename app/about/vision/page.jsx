import AboutSectionPage from '../../../src/components/AboutSectionPage'

export const metadata = {
  title: 'Vision Statement | The Gospel Network',
  description: 'The vision of The Gospel Network for faithful churches, mature believers, and a strong African Reformed witness.',
}

export default function VisionPage() {
  return (
    <AboutSectionPage title="Vision Statement" introduction="Our long-term vision for serving Christ’s Church across Africa.">
      <section aria-labelledby="concise-vision">
        <p id="concise-vision" className="text-[10px] font-bold uppercase tracking-[0.18em] text-heritage-gold">Our concise vision</p>
        <div className="mt-5 border-l-4 border-heritage-gold pl-6 md:pl-9">
          <p className="font-display text-3xl leading-[1.22] text-midnight-navy md:text-5xl">
            To see Africa increasingly conformed to the image of Christ through faithful churches, mature believers, and a strong African Reformed witness.
          </p>
        </div>
      </section>

      <section className="mt-14 border-t border-midnight-navy/15 pt-10" aria-labelledby="full-vision">
        <p id="full-vision" className="text-[10px] font-bold uppercase tracking-[0.18em] text-midnight-navy/40">Our full vision</p>
        <div className="mt-6 space-y-6 text-lg leading-9 text-midnight-navy/70 md:text-xl md:leading-10">
          <p>
            Our vision is to see the whole of Africa increasingly conformed to the image of Christ through the advance of the gospel and the strengthening of faithful local churches. We long to see gospel-preaching churches established throughout the continent—churches marked by meaningful membership, qualified shepherding, sound doctrine, biblical preaching, faithful worship and discipline, mutual accountability, and mature Christian service.
          </p>
          <p>
            We desire to see believers know Scripture more clearly, discern error more carefully, love Christ more deeply, and stand more firmly in the faith once for all delivered to the saints. To this end, we long to cultivate faithful African writers who communicate biblical truth with clarity, courage, theological depth, and pastoral wisdom, and to see a distinctly African Reformed voice established across regions and generations for the strengthening of Christ’s Church.
          </p>
        </div>
      </section>
    </AboutSectionPage>
  )
}
