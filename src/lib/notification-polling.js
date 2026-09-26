// Keep the foreground cadence, but avoid background traffic, overlapping reads,
// and rapid retries during an outage. Return cleanup for the owning effect.
export function startNotificationPolling({ onData, onSettled }) {
  let active = true
  let timer
  let controller
  let failures = 0
  let unauthorized = false

  const load = async () => {
    window.clearTimeout(timer)
    if (!active || document.hidden || controller || unauthorized) return
    controller = new AbortController()
    try {
      const response = await fetch('/api/admin/notifications', {
        cache: 'no-store',
        signal: controller.signal,
      })
      if (!active) return
      if (response.status === 401 || response.status === 403) {
        unauthorized = true
        return
      }
      if (!response.ok) throw new Error('Notification request failed')
      const result = await response.json()
      if (active) {
        failures = 0
        onData(result.data || [])
      }
    } catch (error) {
      if (active && error.name !== 'AbortError') failures = Math.min(failures + 1, 4)
      // Retain the last successful list during a temporary outage.
    } finally {
      controller = null
      if (active) {
        onSettled()
        if (!document.hidden && !unauthorized) {
          timer = window.setTimeout(load, Math.min(30000 * (2 ** failures), 300000))
        }
      }
    }
  }

  const visibilityChanged = () => {
    window.clearTimeout(timer)
    if (!document.hidden) void load()
  }

  document.addEventListener('visibilitychange', visibilityChanged)
  void load()
  return () => {
    active = false
    window.clearTimeout(timer)
    controller?.abort()
    document.removeEventListener('visibilitychange', visibilityChanged)
  }
}
