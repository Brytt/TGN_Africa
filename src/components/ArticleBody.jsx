'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { sanitizeArticleHtml } from '../lib/article-html'

const BOOKS = String.raw`(?:[1-3]\s*)?(?:Genesis|Gen\.?|Exodus|Exod\.?|Leviticus|Lev\.?|Numbers|Num\.?|Deuteronomy|Deut\.?|Joshua|Josh\.?|Judges|Judg\.?|Ruth|Samuel|Sam\.?|Kings|Kgs\.?|Chronicles|Chron\.?|Ezra|Nehemiah|Neh\.?|Esther|Esth\.?|Job|Psalms?|Ps\.?|Proverbs|Prov\.?|Ecclesiastes|Eccl\.?|Song of Solomon|Song of Songs|Isaiah|Isa\.?|Jeremiah|Jer\.?|Lamentations|Lam\.?|Ezekiel|Ezek\.?|Daniel|Dan\.?|Hosea|Hos\.?|Joel|Amos|Obadiah|Obad\.?|Jonah|Micah|Mic\.?|Nahum|Nah\.?|Habakkuk|Hab\.?|Zephaniah|Zeph\.?|Haggai|Hag\.?|Zechariah|Zech\.?|Malachi|Mal\.?|Matthew|Matt\.?|Mark|Luke|John|Acts|Romans|Rom\.?|Corinthians|Cor\.?|Galatians|Gal\.?|Ephesians|Eph\.?|Philippians|Phil\.?|Colossians|Col\.?|Thessalonians|Thess\.?|Timothy|Tim\.?|Titus|Philemon|Philem\.?|Hebrews|Heb\.?|James|Jas\.?|Peter|Pet\.?|Jude|Revelation|Rev\.?)`
const scriptureRegex = () => new RegExp(String.raw`\b${BOOKS}\s*\d{1,3}(?::\d{1,3}(?:\s*[-–—]\s*\d{1,3})?)?(?:\s*[-–—]\s*\d{1,3}(?::\d{1,3})?)?`, 'gi')

export default function ArticleBody({ body, bodyFormat = 'html', emptyMessage = 'This article does not have body content yet.' }) {
  const html = sanitizeArticleHtml(body, { plain: bodyFormat === 'plain' })
  const container = useRef(null)
  const [preview, setPreview] = useState(null)
  const cache = useRef(new Map())

  useEffect(() => {
    const root = container.current
    if (!root) return
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const nodes = []
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (!node.parentElement?.closest('a, button, code, pre, [data-scripture-reference]') && scriptureRegex().test(node.nodeValue)) nodes.push(node)
    }
    nodes.forEach((node) => {
      const pattern = scriptureRegex()
      const fragment = document.createDocumentFragment()
      let cursor = 0
      node.nodeValue.replace(pattern, (match, offset) => {
        fragment.append(node.nodeValue.slice(cursor, offset))
        const button = document.createElement('button')
        button.type = 'button'; button.dataset.scriptureReference = match; button.className = 'tgn-inline-scripture'; button.textContent = match
        fragment.append(button); cursor = offset + match.length
        return match
      })
      fragment.append(node.nodeValue.slice(cursor)); node.replaceWith(fragment)
    })
    const show = async (target) => {
      const reference = target.dataset.scriptureReference
      const rect = target.getBoundingClientRect()
      const width = Math.min(390, window.innerWidth - 32)
      const coordinates = { left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)), top: rect.bottom + 8, width }
      setPreview({ reference, status: 'loading', ...coordinates })
      if (!cache.current.has(reference)) {
        const response = await fetch(`/api/esv?reference=${encodeURIComponent(reference)}`)
        const result = await response.json().catch(() => ({}))
        cache.current.set(reference, response.ok ? result.passage : null)
      }
      setPreview((current) => current?.reference === reference ? { ...current, status: cache.current.get(reference) ? 'ready' : 'error', passage: cache.current.get(reference) } : current)
    }
    const over = (event) => { const target = event.target.closest('[data-scripture-reference]'); if (target) show(target) }
    const out = (event) => { if (event.target.closest('[data-scripture-reference]')) setPreview(null) }
    root.addEventListener('pointerover', over); root.addEventListener('pointerout', out); root.addEventListener('focusin', over); root.addEventListener('focusout', out)
    return () => { root.removeEventListener('pointerover', over); root.removeEventListener('pointerout', out); root.removeEventListener('focusin', over); root.removeEventListener('focusout', out) }
  }, [html])

  if (!html) return <p>{emptyMessage}</p>
  const popup = preview && <div role="tooltip" style={{ left: preview.left, top: preview.top, width: preview.width }} className="fixed z-[150] border border-midnight-navy/10 bg-white p-5 text-left shadow-[0_20px_55px_rgba(13,34,64,0.22)]">{preview.status === 'loading' && <p className="text-xs text-midnight-navy/45">Loading Scripture…</p>}{preview.status === 'error' && <p className="text-xs text-midnight-navy/45">Passage preview unavailable.</p>}{preview.passage && <><p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-midnight-navy/40">{preview.passage.reference} · ESV</p><div className="max-h-[310px] overflow-y-auto font-display text-[15px] leading-7 text-midnight-navy/75 [&_.copyright]:mt-4 [&_.copyright]:font-sans [&_.copyright]:text-[8px] [&_.verse-num]:mr-1 [&_.verse-num]:font-sans [&_.verse-num]:text-[8px]" dangerouslySetInnerHTML={{ __html: preview.passage.html }} /></>}</div>
  return <><div ref={container} className="tgn-article-body" dangerouslySetInnerHTML={{ __html: html }} />{typeof document !== 'undefined' && popup ? createPortal(popup, document.body) : null}</>
}
