import dynamic from 'next/dynamic'

const SettingsPage = dynamic(() => import('./_page/SettingsPage').then((m) => m.SettingsPage), {
  ssr: false,
})

export default function Page() {
  return <SettingsPage />
}
