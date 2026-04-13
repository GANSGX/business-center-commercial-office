'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function getOrCreateVisitorId(): string {
  const key = 'bc_visitor'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const id = generateId()
  localStorage.setItem(key, id)
  return id
}

function trackPageview(pathname: string) {
  const consent = localStorage.getItem('cookie_consent')
  if (consent !== 'accepted') return

  const visitorId = getOrCreateVisitorId()

  fetch('/api/analytics/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      visitorId,
    }),
  }).catch(() => {})
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    trackPageview(pathname)
  }, [pathname])

  useEffect(() => {
    const onConsent = () => trackPageview(pathname)
    window.addEventListener('cookie-consent-accepted', onConsent)
    return () => window.removeEventListener('cookie-consent-accepted', onConsent)
  }, [pathname])

  return null
}
