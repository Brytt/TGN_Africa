import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { notFound } from 'next/navigation'
import AnnouncementBar from '../../../src/components/AnnouncementBar'
import Footer from '../../../src/components/Footer'
import Navbar from '../../../src/components/Navbar'
import { allResourceDocuments, getResourceDocument } from '../../../src/data/resources'

export function generateStaticParams() {
  return allResourceDocuments.map((document) => ({ slug: document.slug }))
}

export async function generateMetadata({ params }) {
  const document = getResourceDocument((await params).slug)
  if (!document) return {}
  return {
    title: document.title,
    description: `Read ${document.title}, ${document.date}, in The Gospel Network historic Christian resources library.`,
  }
}

function parseDocument(raw) {
  const normalized = raw.replace(/\r\n?/g, '\n').trim()
  const titleEnd = normalized.indexOf('\n')
  const noteMatch = /\nEditorial Note:?\s*\n/i.exec(normalized)
  const firstPageBreak = normalized.indexOf('\f')
  let text
  let note = ''

  if (noteMatch && firstPageBreak > noteMatch.index) {
    note = normalized.slice(noteMatch.index + noteMatch[0].length, firstPageBreak).trim()
    text = normalized.slice(firstPageBreak + 1)
  } else if (noteMatch) {
    text = normalized.slice(titleEnd + 1, noteMatch.index)
    note = normalized.slice(noteMatch.index + noteMatch[0].length)
  } else {
    text = normalized.slice(titleEnd + 1)
  }

  const cleanedLines = text.replaceAll('\f', '\n').trim().split('\n')
  if (/^[A-Z\s]+$/.test(cleanedLines[0]?.trim() || '')) cleanedLines.shift()
  return { text: cleanedLines.join('\n').trim(), note }
}

function TextBlock({ text }) {
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean)
  return (
    <div className="resource-document-text">
      {lines.map((line, index) => {
        if (/^(Of |The Holy Spirit$|The Sacraments$|Baptism$|The Lord's Supper$|Gratitude$|Prayer$|Preface$|Contents$|Summary Statement$|Articles? of |Articles? of$|Exposition$|Chapter\s+\d+|CHAPTER\s+[IVXLCDM]+|THE (FIRST|SECOND|THIRD|FOURTH|FIFTH) MAIN POINT|Article\s+([IVXLCDM]+|\d+)\.?$)/i.test(line)) {
          return <h2 key={index}>{line}</h2>
        }
        if (/^Question \d+\./.test(line)) {
          const answerIndex = line.indexOf(' Answer.')
          if (answerIndex > -1) {
            return (
              <section key={index} className="resource-catechism-entry">
                <h3>{line.slice(0, answerIndex)}</h3>
                <p><strong>Answer.</strong>{line.slice(answerIndex + 8)}</p>
              </section>
            )
          }
          return <h3 key={index} className="resource-question">{line}</h3>
        }
        if (/^Answer\./.test(line)) return <p key={index} className="resource-answer"><strong>Answer.</strong>{line.slice(7)}</p>
        if (/^(\d+\.|•)/.test(line)) return <p key={index} className="resource-numbered-line">{line.replace(/^•\s*/, '')}</p>
        return <p key={index}>{line}</p>
      })}
    </div>
  )
}

export default async function ResourceDocumentPage({ params }) {
  const document = getResourceDocument((await params).slug)
  if (!document) notFound()

  let parsed = null
  if (document.file) {
    const raw = await readFile(path.join(process.cwd(), 'public', 'resources', 'documents', document.file), 'utf8')
    parsed = parseDocument(raw)
  }

  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <header className="border-b border-midnight-navy/10 bg-surface-container-low">
          <div className="page-shell max-w-5xl py-14 md:py-20">
            <a href="/resources" className="text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy/45">← Resources library</a>
            <div className="mt-10 flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[0.14em]">
              <span className="bg-midnight-navy px-3 py-1.5 text-white">{document.type}</span>
              <span className="text-midnight-navy/40">{document.collection}</span>
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(3rem,7vw,6rem)] leading-[0.94] tracking-[-0.03em] text-midnight-navy">{document.title}</h1>
            <p className="mt-6 font-display text-2xl text-heritage-gold">{document.date}</p>
          </div>
        </header>

        {parsed ? (
          <div className="page-shell grid max-w-6xl gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:py-20">
            <article>
              <div className="mb-10 flex items-center gap-4 border-b border-midnight-navy/15 pb-5">
                <span className="grid size-10 place-items-center rounded-full bg-midnight-navy text-white"><span className="material-symbols-outlined text-[19px]">history_edu</span></span>
                <div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-heritage-gold">Historical document</p><p className="mt-1 text-xs text-midnight-navy/45">The creedal or confessional text</p></div>
              </div>
              <TextBlock text={parsed.text} />
            </article>

            <aside
              className="resource-note-scroll border-t-4 border-heritage-gold bg-surface-container-low p-7 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain"
              tabIndex={0}
              aria-label="TGN editorial note; scroll to read the complete note"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-heritage-gold">TGN Editorial Note</p>
              <h2 className="mt-4 font-display text-2xl leading-tight text-midnight-navy">Reading this document carefully</h2>
              {parsed.note ? (
                <div className="mt-6 space-y-4 text-sm leading-7 text-midnight-navy/65">
                  {parsed.note.split(/\n+/).map((paragraph, index) => paragraph.trim() && <p key={index}>{paragraph.trim()}</p>)}
                </div>
              ) : (
                <p className="mt-6 text-sm leading-7 text-midnight-navy/65">This reader edition reproduces the supplied historical document. No additional TGN editorial commentary has been attached to this edition.</p>
              )}
              <p className="mt-7 border-t border-midnight-navy/10 pt-5 text-[10px] leading-5 text-midnight-navy/40">This editorial material is commentary from The Gospel Network. It is not part of the historical document itself.</p>
            </aside>
          </div>
        ) : (
          <section className="page-shell max-w-4xl py-24 text-center">
            <span className="material-symbols-outlined text-5xl text-heritage-gold">menu_book</span>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy/40">Editorial preparation</p>
            <h2 className="mt-4 font-display text-4xl text-midnight-navy">Reader edition forthcoming.</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-midnight-navy/55">This document has its place in the library, but its source text and editorial introduction are still being prepared and verified. We will publish it without silently substituting another edition.</p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
