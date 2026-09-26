import 'server-only'
import { revalidateTag, unstable_cache } from 'next/cache'

const PUBLIC_CONTENT_TAG = 'public-content-v1'

// Only wrap anonymous, public reads. Loaders must throw on database errors so
// an outage is never stored as a successful empty result in the Data Cache.
export function cachePublicContent(key, loader) {
  return unstable_cache(loader, [PUBLIC_CONTENT_TAG, key], {
    revalidate: 60,
    tags: [PUBLIC_CONTENT_TAG],
  })
}

export function invalidatePublicContent() {
  // Expire immediately: archived/deleted content must not be served stale after
  // a successful editorial change. Next also invalidates dependent route output.
  revalidateTag(PUBLIC_CONTENT_TAG, { expire: 0 })
}
