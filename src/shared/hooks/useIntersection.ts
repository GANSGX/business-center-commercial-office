import { useEffect, useRef, useState } from 'react'

interface UseIntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersection(options: UseIntersectionOptions = {}) {
  const { freezeOnceVisible = true, ...observerOptions } = options
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        if (freezeOnceVisible) observer.disconnect()
      }
    }, observerOptions)

    observer.observe(el)
    return () => observer.disconnect()
  }, [freezeOnceVisible, observerOptions])

  return { ref, isVisible }
}
