import { sanitizeArticleHtml } from '../lib/article-html'

export default function ArticleBody({ body, bodyFormat = 'html', emptyMessage = 'This article does not have body content yet.' }) {
  const html = sanitizeArticleHtml(body, { plain: bodyFormat === 'plain' })
  if (!html) return <p>{emptyMessage}</p>

  return <div className="tgn-article-body" dangerouslySetInnerHTML={{ __html: html }} />
}
