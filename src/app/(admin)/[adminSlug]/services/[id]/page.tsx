import dynamic from 'next/dynamic'

const ServiceEditPage = dynamic(
  () => import('./_page/ServiceEditPage').then((m) => m.ServiceEditPage),
  { ssr: false }
)

interface Props {
  params: Promise<{ adminSlug: string; id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <ServiceEditPage serviceId={id} />
}
