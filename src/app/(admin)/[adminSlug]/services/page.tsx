import dynamic from 'next/dynamic'

const ServicesAdminPage = dynamic(
  () => import('./_page/ServicesAdminPage').then((m) => m.ServicesAdminPage),
  { ssr: false }
)

export default function Page() {
  return <ServicesAdminPage />
}
