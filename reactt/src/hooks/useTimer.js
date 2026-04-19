import { useEffect, useState } from 'react'

export function useLiveNow(intervalMs = 60000) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(Date.now())
    }, intervalMs)

    return () => {
      window.clearInterval(timerId)
    }
  }, [intervalMs])

  return now
}

export function formatTimeAgo(timestamp, now = Date.now()) {
  if (!timestamp) {
    return 'Not recorded yet'
  }

  const elapsedMinutes = Math.max(0, Math.floor((now - timestamp) / 60000))

  if (elapsedMinutes < 1) {
    return 'just now'
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} mins ago`
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60)

  if (elapsedHours < 24) {
    return `${elapsedHours} hrs ago`
  }

  const elapsedDays = Math.floor(elapsedHours / 24)
  return `${elapsedDays} days ago`
}

export function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }

  return `${seconds}s`
}