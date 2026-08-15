'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { sanitizeArticleHtml } from '../lib/article-html'
import ScriptureModal from './ScriptureModal'

const BOOKS = String.raw`(?:[1-3]\s*)?(?:Genesis|Gen\.?|Exodus|Exod\.?|Leviticus|Lev\.?|Numbers|Num\.?|Deuteronomy|Deut\.?|Joshua|Josh\.?|Judges|Judg\.?|Ruth|Samuel|Sam\.?|Kings|Kgs\.?|Chronicles|Chron\.?|Ezra|Nehemiah|Neh\.?|Esther|Esth\.?|Job|Psalms?|Ps\.?|Proverbs|Prov\.?|Ecclesiastes|Eccl\.?|Song of Solomon|Song of Songs|Isaiah|Isa\.?|Jeremiah|Jer\.?|Lamentations|Lam\.?|Ezekiel|Ezek\.?|Daniel|Dan\.?|Hosea|Hos\.?|Joel|Amos|Obadiah|Obad\.?|Jonah|Micah|Mic\.?|Nahum|Nah\.?|Habakkuk|Hab\.?|Zephaniah|Zeph\.?|Haggai|Hag\.?|Zechariah|Zech\.?|Malachi|Mal\.?|Matthew|Matt\.?|Mark|Luke|John|Acts|Romans|Rom\.?|Corinthians|Cor\.?|Galatians|Gal\.?|Ephesians|Eph\.?|Philippians|Phil\.?|Colossians|Col\.?|Thessalonians|Thess\.?|Timothy|Tim\.?|Titus|Philemon|Philem\.?|Hebrews|Heb\.?|James|Jas\.?|Peter|Pet\.?|Jude|Revelation|Rev\.?)`
const scriptureRegex = () => new RegExp(String.raw`\b${BOOKS}\s*\d{1,3}(?::\d{1,3}(?:\s*[-–—]\s*\d{1,3})?)?(?:\s*[-–—]\s*\d{1,3}(?::\d{1,3})?)?`, 'gi')

export default function ArticleBody({ body, bodyFormat = 'html', emptyMessage = 'This article does not have body content yet.' }) {
  const html = sanitizeArticleHtml(body, { plain: bodyFormat === 'plain' })
  const id = useId()
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
      window.dispatchEvent(new CustomEvent('tgn-scripture-open', { detail: id }))
      setPreview({ reference, status: 'loading' })
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
  }, [html, id])

  if (!html) return <p>{emptyMessage}</p>
  return <><div ref={container} className="tgn-article-body" dangerouslySetInnerHTML={{ __html: html }} />{preview && <ScriptureModal preview={preview} onClose={() => setPreview(null)} />}</>
}
