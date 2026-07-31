import AboutSectionPage from '../../../src/components/AboutSectionPage'

export const metadata = {
  title: 'Mission Statement | The Gospel Network',
  description: 'The mission of The Gospel Network.',
}

export default function MissionPage() {
  return (
    <AboutSectionPage title="Mission Statement" introduction="Declaring the Whole Counsel of God for the Saints of Africa">
      <div className="border-l-4 border-heritage-gold pl-6 md:pl-9">
        <p className="font-display text-3xl leading-[1.22] text-midnight-navy md:text-5xl">
          “Declaring the Whole Counsel of God for the Saints of Africa”
        </p>
      </div>
      <div className="mt-12 border-t border-midnight-navy/15 pt-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-midnight-navy/40">Our full mission</p>
        <p className="mt-5 text-lg leading-9 text-midnight-navy/70 md:text-xl md:leading-10">
          The Gospel Network exists to declare the whole counsel of God for the saints of Africa by publishing faithful, clear, and pastorally useful biblical resources that proclaim Christ, strengthen local churches, confront error, and equip believers for maturity and faithful living.
        </p>
      </div>
      <div className="mt-14 border-t border-midnight-navy/15 pt-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-heritage-gold">An exposition of our mission</p>
        <div className="mt-8 space-y-9">
          <section>
            <h2 className="font-display text-3xl text-midnight-navy">Declaring</h2>
            <p className="mt-3 text-base leading-8 text-midnight-navy/65">Our work is fundamentally an act of proclamation. We publish so that God’s truth may be stated faithfully, explained clearly, and brought to bear pastorally upon the life of the Church. We seek neither novelty nor attention for its own sake, but a public witness governed by Holy Scripture.</p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-midnight-navy">The Whole Counsel of God</h2>
            <p className="mt-3 text-base leading-8 text-midnight-navy/65">Drawn from Acts 20:26–27, this phrase commits us to the breadth of God’s revealed truth. We will not restrict Christian teaching to fashionable themes or avoid difficult doctrines. Our desire is to publish resources shaped by the full testimony of Scripture, centred upon Christ, and useful for faith and obedience.</p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-midnight-navy">For the Saints</h2>
            <p className="mt-3 text-base leading-8 text-midnight-navy/65">The resources of The Gospel Network are offered for the strengthening of believers and the health of local churches. They are intended to clarify truth, confront error, encourage holiness, deepen Christian maturity, and equip the people of God for faithful life and service.</p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-midnight-navy">Of Africa</h2>
            <p className="mt-3 text-base leading-8 text-midnight-navy/65">We serve Christians across Africa with a consciously continental concern. This means listening to African pastors and writers, addressing the questions and errors facing African churches, and contributing African voices to the historic and global fellowship of Christian faith—without treating culture, geography, or experience as an authority above Scripture.</p>
          </section>
        </div>
      </div>
    </AboutSectionPage>
  )
}
