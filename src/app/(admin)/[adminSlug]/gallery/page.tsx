import dynamic from 'next/dynamic'

const GalleryAdminPage = dynamic(
  () => import('./_page/GalleryAdminPage').then((m) => m.GalleryAdminPage),
  { ssr: false }
)

export default function Page() {
  return <GalleryAdminPage />
}
