'use client'

import { useEffect } from 'react'

function record(sermonId, eventType) {
  const key = `tgn-sermon-event:${sermonId}:${eventType}`
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')
  fetch('/api/sermon-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sermonId, eventType }),
  }).catch(() => sessionStorage.removeItem(key))
}

export function SermonViewTracker({ sermonId, primaryEvent = 'listen' }) {
  useEffect(() => {
    record(sermonId, 'page_view')
    const onPlay = (event) => {
      if (event.target instanceof HTMLAudioElement) record(sermonId, 'listen')
      if (event.target instanceof HTMLVideoElement) record(sermonId, 'watch')
    }
    const onClick = (event) => {
      if (event.target.closest?.('a[href="#sermon-player"]')) record(sermonId, primaryEvent)
    }
    document.addEventListener('play', onPlay, true)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('play', onPlay, true)
      document.removeEventListener('click', onClick)
    }
  }, [primaryEvent, sermonId])
  return null
}

export function SermonAction({ sermonId, eventType, className, children }) {
  return <a href="#sermon-player" className={className} onClick={() => record(sermonId, eventType)}>{children}</a>
}

export function TrackedAudio({ sermonId, ...props }) {
  return <audio {...props} onPlay={() => record(sermonId, 'listen')} />
}

export function TrackedVideo({ sermonId, ...props }) {
  return <video {...props} onPlay={() => record(sermonId, 'watch')} />
}
