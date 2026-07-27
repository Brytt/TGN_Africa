import AboutSectionPage, { ForthcomingNotice } from '../../../src/components/AboutSectionPage'
import { getAuthors } from '../../../src/lib/data'

export const metadata = { title: 'Message from the Managing Editor | The Gospel Network' }

export default async function ManagingEditorMessagePage() {
  const authors = await getAuthors()
  const editor = authors.find((author) => /\b(michael|mike)\b/i.test(author.name))

  return (
    <AboutSectionPage title="Message from the Managing Editor" introduction="A word on our editorial calling and service to the African church.">
      {editor && (
        <div className="mb-10 grid items-center gap-6 border-y border-midnight-navy/10 py-6 sm:grid-cols-[110px_1fr]">
          {editor.image ? <img src={editor.image} alt={editor.name} className="aspect-square w-[110px] object-cover" /> : <div className="grid size-[110px] place-items-center bg-midnight-navy text-2xl text-white">ME</div>}
          <div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-heritage-gold">Managing Editor</p><h2 className="mt-2 font-display text-3xl text-midnight-navy">{editor.name}</h2></div>
        </div>
      )}
      <ForthcomingNotice item="message from the Managing Editor" />
    </AboutSectionPage>
  )
}
