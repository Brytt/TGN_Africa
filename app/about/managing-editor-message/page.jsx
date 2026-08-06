import AboutSectionPage from '../../../src/components/AboutSectionPage'
import { getAuthors } from '../../../src/lib/data'

export const revalidate = 60

export const metadata = { title: 'Message from the Managing Editor | The Gospel Network' }

export default async function ManagingEditorMessagePage() {
  const authors = await getAuthors()
  const editor = authors.find((author) => /\b(michael|mike)\b/i.test(author.name))

  return (
    <AboutSectionPage title="Message from the Managing Editor" introduction="A word on our editorial calling and service to the African church.">
      {editor && (
        <div className="mb-10 grid items-center gap-6 border-y border-midnight-navy/10 py-6 sm:grid-cols-[110px_1fr]">
          {editor.image ? <img src={editor.image} alt={editor.name} className="aspect-square w-[110px] object-cover" /> : <div className="grid size-[110px] place-items-center bg-midnight-navy text-2xl text-white">ME</div>}
          <div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-heritage-gold">Managing Editor</p><h2 className="tgn-display-heading mt-2 text-3xl text-midnight-navy">{editor.name}</h2></div>
        </div>
      )}
      <article className="tgn-statement-copy space-y-7 text-[17px] leading-8 md:text-[19px] md:leading-9">
        <p>When I joined The Gospel Network (TGN) in 2023, I entered a work that had already been faithfully sustained for many years. It is a privilege now to assume greater editorial responsibility and to help strengthen the platform for the work ahead.</p>
        <p>I am grateful for the founding vision of Kwesi Sena and for the faithful labors of the brothers who have written, edited, and sustained this ministry over the years.</p>
        <p>I write as a Christian, a South African, a husband, a father, and an elder in my local church. My Reformed Baptist convictions shape how I approach Scripture, theology, the local church, and editorial ministry.</p>
        <p>The burden I hope to bring to TGN is captured in Acts 20:26–27, where Paul states:</p>
        <blockquote className="border-l-4 border-heritage-gold py-2 pl-6 font-display text-2xl italic leading-9 text-midnight-navy md:pl-9 md:text-3xl md:leading-10">
          “Therefore I testify to you this day that I am innocent of the blood of all, for I did not shrink from declaring to you the whole counsel of God.”
        </blockquote>
        <p>My desire is that TGN would continue to serve as a trustworthy library of biblical resources for the saints of Africa. We should not publish merely to maintain a schedule, react to controversy, or follow passing theological trends. We should aim to address the breadth of God’s revealed truth with biblical faithfulness, theological depth, pastoral warmth, and gospel clarity.</p>
        <p>Faithfulness to the whole counsel of God will sometimes require confronting errors that trouble African churches, including prosperity theology, Word of Faith teaching, syncretism, ancestor veneration, false prophecy, and cultural Christianity.</p>
        <p>Yet we must devote even greater attention to explaining Scripture, teaching sound doctrine, proclaiming Christ, strengthening local churches, commending the historic Christian faith grounded in Scripture, and showing how the gospel shapes ordinary Christian life.</p>
        <p>I also hope that TGN will continue to cultivate faithful African writers who can communicate biblical truth with clarity, courage, and pastoral wisdom.</p>
        <p>My hope is that, one faithful article at a time, TGN will help believers across Africa know the Scriptures more clearly, discern error more carefully, love Christ more deeply, and stand more firmly in the faith once for all delivered to the saints.</p>
        <p className="font-display text-2xl italic text-midnight-navy">May we not shrink from declaring the whole counsel of God.</p>
        <footer className="border-t border-midnight-navy/15 pt-7">
          <p className="tgn-display-heading text-2xl text-midnight-navy">Michael Franco Smit</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.17em] text-heritage-gold">Managing Editor</p>
        </footer>
      </article>
    </AboutSectionPage>
  )
}
