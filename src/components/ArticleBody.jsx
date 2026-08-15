'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { sanitizeArticleHtml } from '../lib/article-html'
import ScriptureModal from './ScriptureModal'

const BOOKS = String.raw`(?:[1-3]\s*)?(?:Genesis|Gen\.?|Exodus|Exod\.?|Leviticus|Lev\.?|Numbers|Num\.?|Deuteronomy|Deut\.?|Joshua|Josh\.?|Judges|Judg\.?|Ruth|Samuel|Sam\.?|Kings|Kgs\.?|Chronicles|Chron\.?|Ezra|Nehemiah|Neh\.?|Esther|Esth\.?|Job|Psalms?|Ps\.?|Proverbs|Prov\.?|Ecclesiastes|Eccl\.?|Song of Solomon|Song of Songs|Isaiah|Isa\.?|Jeremiah|Jer\.?|Lamentations|Lam\.?|Ezekiel|Ezek\.?|Daniel|Dan\.?|Hosea|Hos\.?|Joel|Amos|Obadiah|Obad\.?|Jonah|Micah|Mic\.?|Nahum|Nah\.?|Habakkuk|Hab\.?|Zephaniah|Zeph\.?|Haggai|Hag\.?|Zechariah|Zech\.?|Malachi|Mal\.?|Matthew|Matt\.?|Mt\.?|Mark|Mk\.?|Luke|Lk\.?|John|Jn\.?|Acts|Romans|Rom\.?|Corinthians|Cor\.?|Galatians|Gal\.?|Ephesians|Eph\.?|Philippians|Phil\.?|Colossians|Col\.?|Thessalonians|Thess\.?|Timothy|Tim\.?|Titus|Philemon|Philem\.?|Hebrews|Heb\.?|James|Jas\.?|Peter|Pet\.?|Jude|Revelation|Rev\.?)`
const scriptureRegex = () => new RegExp(String.raw`\b${BOOKS}\s*\d{1,3}(?::\d{1,3}(?:\s*[-–—]\s*\d{1,3})?)?(?:\s*[-–—]\s*\d{1,3}(?::\d{1,3})?)?(?:\s*[,;]\s*\d{1,3}(?::\d{1,3})?(?:\s*[-–—]\s*\d{1,3})?)*`, 'gi')

function addScriptureTargets(html) {
  const blockedTags = new Set(['a', 'button', 'code', 'pre'])
  let blockedDepth = 0
  return html.split(/(<[^>]+>)/g).map((part) => {
    if (part.startsWith('<')) {
      const closing = part.match(/^<\/\s*([a-z0-9]+)/i)?.[1]?.toLowerCase()
      const opening = part.match(/^<\s*([a-z0-9]+)/i)?.[1]?.toLowerCase()
      if (closing && blockedTags.has(closing)) blockedDepth = Math.max(0, blockedDepth - 1)
      const output = part
      if (opening && blockedTags.has(opening) && !part.startsWith('</') && !part.endsWith('/>')) blockedDepth += 1
      return output
    }
    if (blockedDepth || !part) return part
    return part.replace(scriptureRegex(), (reference) => `<button type="button" class="tgn-inline-scripture" data-scripture-reference="${reference}">${reference}</button>`)
  }).join('')
}

export default function ArticleBody({ body, bodyFormat = 'html', emptyMessage = 'This article does not have body content yet.' }) {
  const html = sanitizeArticleHtml(body, { plain: bodyFormat === 'plain' })
  const enhancedHtml = addScriptureTargets(html)
  const id = useId()
  const container = useRef(null)
  const [preview, setPreview] = useState(null)
  const cache = useRef(new Map())

  useEffect(() => {
    const root = container.current
    if (!root) return
    const show = async (target) => {
      const reference = target.dataset.scriptureReference
      window.dispatchEvent(new CustomEvent('tgn-scripture-open', { detail: id }))
      const rect = target.getBoundingClientRect()
      const width = Math.min(360, window.innerWidth - 24)
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)) + window.scrollX
      const top = rect.bottom + window.scrollY + 8
      setPreview({ reference, status: 'loading', position: { left, top, width } })
      if (!cache.current.has(reference)) {
        const response = await fetch(`/api/esv?reference=${encodeURIComponent(reference)}`)
        const result = await response.json().catch(() => ({}))
        cache.current.set(reference, response.ok ? result.passage : null)
      }
      setPreview((current) => current?.reference === reference ? { ...current, status: cache.current.get(reference) ? 'ready' : 'error', passage: cache.current.get(reference) } : current)
    }
    const over = (event) => { const target = event.target.closest('[data-scripture-reference]'); if (target) show(target) }
    const closeOther = (event) => { if (event.detail !== id) setPreview(null) }
    root.addEventListener('pointerover', over); root.addEventListener('focusin', over); window.addEventListener('tgn-scripture-open', closeOther)
    return () => { root.removeEventListener('pointerover', over); root.removeEventListener('focusin', over); window.removeEventListener('tgn-scripture-open', closeOther) }
  }, [enhancedHtml, id])

  if (!html) return <p>{emptyMessage}</p>
  return <><div ref={container} className="tgn-article-body" dangerouslySetInnerHTML={{ __html: enhancedHtml }} />{preview && <ScriptureModal preview={preview} onClose={() => setPreview(null)} />}</>
}
