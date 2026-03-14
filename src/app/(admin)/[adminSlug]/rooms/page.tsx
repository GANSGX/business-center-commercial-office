import dynamic from 'next/dynamic'

const RoomsPage = dynamic(() => import('./_page/RoomsPage').then((m) => m.RoomsPage), {
  ssr: false,
})

export default function Page() {
  return <RoomsPage />
}
