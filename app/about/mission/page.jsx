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
    </AboutSectionPage>
  )
}
