import { Fragment } from 'react'

function decodeEntities(value) {
  const named = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  }
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const radix = entity[1]?.toLowerCase() === 'x' ? 16 : 10
      const digits = radix === 16 ? entity.slice(2) : entity.slice(1)
      return String.fromCodePoint(Number.parseInt(digits, radix))
    }
    return named[entity.toLowerCase()] ?? match
  })
}

export function articleText(value = '') {
  return decodeEntities(String(value))
    .replace(/<\s*h2[^>]*>([\s\S]*?)<\s*\/\s*h2\s*>/gi, '\n\n## $1\n\n')
    .replace(/<\s*h[3-6][^>]*>([\s\S]*?)<\s*\/\s*h[3-6]\s*>/gi, '\n\n### $1\n\n')
    .replace(/<\s*blockquote[^>]*>([\s\S]*?)<\s*\/\s*blockquote\s*>/gi, '\n\n> $1\n\n')
    .replace(/<\s*li[^>]*>([\s\S]*?)<\s*\/\s*li\s*>/gi, '\n• $1')
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/\s*(p|div|ul|ol|figure|figcaption)\s*>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function ArticleBody({ body, emptyMessage = 'This article does not have body content yet.' }) {
  const text = articleText(body)
  if (!text) return <p>{emptyMessage}</p>

  return (
    <div className="tgn-article-body">
      {text.split(/\n{2,}/).map((block, index) => {
        const content = block.trim()
        if (!content) return null
        if (content.startsWith('## ')) return <h2 key={index}>{content.slice(3).trim()}</h2>
        if (content.startsWith('### ')) return <h3 key={index}>{content.slice(4).trim()}</h3>
        if (content.startsWith('> ')) return <blockquote key={index}>{content.replace(/^>\s?/gm, '').trim()}</blockquote>
        if (content.split('\n').every((line) => line.trim().startsWith('• '))) {
          return <ul key={index}>{content.split('\n').map((line, lineIndex) => <li key={lineIndex}>{line.replace(/^•\s*/, '')}</li>)}</ul>
        }
        return <p key={index}>{content.split('\n').map((line, lineIndex) => <Fragment key={lineIndex}>{lineIndex > 0 && <br />}{line}</Fragment>)}</p>
      })}
    </div>
  )
}
