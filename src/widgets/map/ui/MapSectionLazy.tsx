'use client'

import dynamic from 'next/dynamic'

const MapSection = dynamic(() => import('./MapSection').then((m) => ({ default: m.MapSection })), {
  ssr: false,
})

export function MapSectionLazy() {
  return <MapSection />
}
