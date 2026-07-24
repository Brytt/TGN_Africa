import ArticlePage from '../../../src/views/ArticlePage'

export const metadata = {
  title: 'Article',
  description: 'Read this article from The Gospel Network Africa.',
}

export default async function Page({ params }) {
  const { id } = await params
  return <ArticlePage articleId={id} />
}
