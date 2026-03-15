'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getOrCreateVisitorId(): string | null {
  try {
    const key = 'bc_visitor'
    const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`))
    if (match) return decodeURIComponent(match[1])

    const id = crypto.randomUUID()
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `${key}=${id}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    return id
  } catch {
    return null
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname

    // Трекаем только после явного согласия пользователя с cookie banner
    const consent = localStorage.getItem('cookie_consent')
    if (consent !== 'accepted') return

    const visitorId = getOrCreateVisitorId()
    if (!visitorId) return

    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        visitorId,
      }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
