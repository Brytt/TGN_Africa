import AboutSectionPage from '../../../src/components/AboutSectionPage'

export const metadata = {
  title: 'Mission Statement | The Gospel Network',
  description: 'The mission of The Gospel Network.',
}

const sections = [
  {
    title: 'The Gospel Network exists…',
    paragraphs: [
      'TGN is not merely a collection of individual writers, an informal blog, or a platform maintained for its own visibility. It exists for a defined ministry purpose. Its contributors labour together as a network in service of the gospel and the Church.',
      'TGN is unashamedly Protestant and explicitly Reformed. We stand within the theological inheritance of the Protestant Reformation, confessing the supreme authority and sufficiency of Scripture and salvation by God’s grace alone, through faith alone, in Christ alone, to the glory of God alone. Our Reformed convictions shape how we understand God, Scripture, salvation, the Church, and the Christian life. These are not merely historical labels or denominational preferences; they provide the theological framework from which we write, teach, and evaluate every contribution.',
    ],
  },
  {
    title: '…to declare…',
    paragraphs: [
      '“Declare” conveys conviction, clarity, and public responsibility. TGN does not approach Scripture as a source of endlessly uncertain religious reflection. God has spoken, and the task of the platform is to explain, defend, and apply what He has revealed.',
      'As a Protestant and Reformed platform, we believe that the written Word of God is the final authority by which every doctrine, tradition, cultural assumption, and religious claim must be judged. Our declaration should nevertheless be marked by humility, careful study, pastoral warmth, courage, and accountability to the local church.',
    ],
  },
  {
    title: '…the whole counsel of God…',
    paragraphs: [
      'This is the controlling burden from Acts 20:26–27. TGN must resist becoming narrowly defined by fashionable questions, recurring controversies, or the favourite doctrines of its contributors.',
      'The whole counsel of God calls for breadth:',
    ],
    items: [
      'biblical exposition;',
      'systematic and biblical theology;',
      'the person and work of Christ;',
      'salvation;',
      'the Church;',
      'Christian living;',
      'marriage and family;',
      'missions and evangelism;',
      'penal substitutionary atonement;',
      'church history;',
      'suffering and perseverance;',
      'African pastoral and cultural questions;',
      'the return of Christ and the hope of the new creation.',
    ],
    closing: 'It requires courage to address neglected or difficult truths, but also discipline not to become merely reactionary.',
  },
  {
    title: '…for the saints of Africa…',
    paragraphs: [
      'The primary audience is the Church in and arising from the African context. “The saints” identifies the work as pastoral and ecclesial. TGN does not primarily exist to comment on Africa from a distance, but to instruct, encourage, protect, and mature Christ’s people.',
      '“Of Africa” also accommodates African believers living beyond the continent while preserving the platform’s unmistakable African identity and burden.',
    ],
  },
  {
    title: '…by publishing faithful, clear, and pastorally useful biblical resources…',
    paragraphs: [
      'The chief contribution of TGN is its growing library of resources: articles, sermons, reviews, interviews, series, and other forms of theological instruction.',
      'Each resource should therefore aim to be:',
    ],
    items: [
      'faithful, submitting its claims to Scripture;',
      'clear, making truth understandable without unnecessary complexity;',
      'pastorally useful, serving actual Christians, households, and churches rather than displaying the knowledge of the writer;',
      'enduring, remaining useful beyond the immediate publishing cycle.',
    ],
    closing: 'TGN is building a library, not merely maintaining a content feed.',
  },
  {
    title: '…that proclaim Christ…',
    paragraphs: [
      'Christ is not one subject among many. He is the centre, foundation, and goal of the Christian faith. Even when an article addresses church history, family life, false teaching, politics, suffering, or work, it should remain connected to God’s redemptive purposes in Christ.',
      'The cross at the centre of TGN’s visual identity expresses this same conviction.',
    ],
  },
  {
    title: '…strengthen local churches…',
    paragraphs: [
      'TGN’s theological writing should arise from and return to the life of the local church. Contributors are not isolated religious commentators constructing personal platforms. They are Christians serving from within the membership, ministry, discipline, worship, and accountability of Christ’s visible Church. This church-centred character is already central to the mission document’s account of TGN’s contributors and intended service.',
      'We do not regard formal church membership as an optional supplement to the Christian life. Although membership in a local church is not the ground of salvation, it is the ordinary and non-negotiable expression of Christian belonging, obedience, accountability, service, and submission to Christ’s appointed means of shepherding His people. Christians are called not merely to attend churches but to belong recognisably to a particular congregation wherever a faithful local church is accessible.',
      'The platform should therefore help churches and believers:',
    ],
    items: [
      'understand and teach Scripture;',
      'cultivate sound doctrine;',
      'recognise qualified leadership;',
      'practise meaningful membership;',
      'exercise loving accountability and discipline;',
      'resist false teaching;',
      'grow in holiness and unity;',
      'fulfil their mission faithfully.',
    ],
  },
  {
    title: '…confront error…',
    paragraphs: [
      'Faithfulness to the whole counsel of God requires direct engagement with errors that trouble African churches, including prosperity theology, Word of Faith teaching, syncretism, ancestor veneration, false prophecy, abusive deliverance practices, and forms of cultural Christianity lacking biblical substance.',
      'It also requires us to address Islam, which exercises profound religious and cultural influence across much of Africa. Islam is not merely another Christian denomination or an alternative expression of faith in the same God. Its denial of the Trinity, the divine Sonship of Christ, His atoning death and resurrection, and the final authority of the biblical Scriptures places it in fundamental conflict with the Christian gospel.',
      'Yet correction must remain subordinate to construction. TGN should devote even greater energy to teaching the truth that exposes and displaces error. The platform must not become known chiefly for what it opposes, but for the fullness of the biblical truth it proclaims.',
    ],
  },
  {
    title: '…and equip believers for maturity and faithful living.',
    paragraphs: [
      'The final aim is not the production of articles but the maturity of people.',
      'This connects the Acts 20 burden with Colossians 1:28:',
    ],
    quote: '“Him we proclaim, warning everyone and teaching everyone with all wisdom, that we may present everyone mature in Christ.”',
    closing: 'TGN seeks to help believers know Scripture more clearly, discern error more carefully, love Christ more deeply, serve His Church more faithfully, and live under His lordship in every sphere of life.',
  },
]

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
        <div className="mt-8 divide-y divide-midnight-navy/10">
          {sections.map((section) => (
            <section key={section.title} className="py-9 first:pt-0">
              <h2 className="font-display text-3xl leading-tight text-midnight-navy md:text-4xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-midnight-navy/70">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items && (
                  <ul className="grid gap-x-8 gap-y-2 border-l-2 border-heritage-gold/60 py-1 pl-6 md:grid-cols-2">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
                {section.quote && (
                  <blockquote className="border-l-2 border-heritage-gold pl-5 font-display text-xl italic leading-8 text-midnight-navy">
                    {section.quote}
                  </blockquote>
                )}
                {section.closing && <p>{section.closing}</p>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AboutSectionPage>
  )
}
