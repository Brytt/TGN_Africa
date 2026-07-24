import CommentManager from '../../../src/components/admin/CommentManager'
import { getModerationComments } from '../../../src/lib/data'

export const metadata = { title: 'Comment Moderation' }

export default async function CommentsPage() {
  return <CommentManager initialComments={await getModerationComments()} />
}
