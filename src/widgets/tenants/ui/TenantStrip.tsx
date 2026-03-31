'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect } from 'react'
import styles from './Tenants.module.css'

function OrgIcon({ category }: { category: string }) {
  if (category === 'food') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 .55.45 1 1 1h3m0 0v5" />
      </svg>
    )
  }
  if (category === 'service') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    )
  }
  if (category === 'retail') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    )
  }
  if (category === 'bank') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="22" x2="21" y2="22" />
        <line x1="6" y1="18" x2="6" y2="11" />
        <line x1="10" y1="18" x2="10" y2="11" />
        <line x1="14" y1="18" x2="14" y2="11" />
        <line x1="18" y1="18" x2="18" y2="11" />
        <polygon points="12 2 20 7 4 7" />
      </svg>
    )
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

interface Org {
  id: string
  name: string
  category: string
  color: string
  logo: string | null
}

export function TenantStrip({ orgs }: { orgs: Org[] }) {
  const stripRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  useEffect(() => {
    const el = stripRef.current
    if (!el) return

    function onMouseDown(e: MouseEvent) {
      isDragging.current = true
      startX.current = e.pageX - el!.offsetLeft
      scrollLeft.current = el!.scrollLeft
      el!.style.cursor = 'grabbing'
      el!.style.userSelect = 'none'
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return
      e.preventDefault()
      const x = e.pageX - el!.offsetLeft
      const walk = x - startX.current
      el!.scrollLeft = scrollLeft.current - walk
    }

    function onMouseUp() {
      isDragging.current = false
      el!.style.cursor = 'grab'
      el!.style.userSelect = ''
    }

    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div className={styles.stripWrapper}>
      <div className={styles.strip} ref={stripRef}>
        {orgs.map((org) => (
          <Link
            key={org.id}
            href={`/in-building#org-${org.id}`}
            className={`${styles.card} ${styles[`color_${org.color}`]}`}
            draggable={false}
          >
            <span className={styles.cardIcon}>
              {org.logo ? (
                <Image
                  src={org.logo}
                  alt={org.name}
                  width={36}
                  height={36}
                  className={styles.cardLogoImg}
                  draggable={false}
                />
              ) : (
                <OrgIcon category={org.category} />
              )}
            </span>
            <span className={styles.cardName}>{org.name}</span>
          </Link>
        ))}
      </div>
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />
    </div>
  )
}
