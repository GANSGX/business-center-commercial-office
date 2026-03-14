import dynamic from 'next/dynamic'

const HeroSlidesPage = dynamic(
  () => import('./_page/HeroSlidesPage').then((m) => m.HeroSlidesPage),
  { ssr: false }
)

export default function Page() {
  return <HeroSlidesPage />
}
