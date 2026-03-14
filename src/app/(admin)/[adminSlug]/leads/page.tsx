import dynamic from 'next/dynamic'

const LeadsPage = dynamic(() => import('./_page/LeadsPage').then((m) => m.LeadsPage), {
  ssr: false,
})

export default function Page() {
  return <LeadsPage />
}
