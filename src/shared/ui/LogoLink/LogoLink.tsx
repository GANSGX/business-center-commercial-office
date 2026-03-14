'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface LogoLinkProps {
  className?: string
  'aria-label'?: string
  onClick?: () => void
  children: React.ReactNode
}

export function LogoLink({ className, 'aria-label': ariaLabel, onClick, children }: LogoLinkProps) {
  const pathname = usePathname()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.()
      if (pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [pathname, onClick]
  )

  return (
    <Link href="/" className={className} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </Link>
  )
}
