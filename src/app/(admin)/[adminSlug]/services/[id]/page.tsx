import { ServiceEditPage } from './_page/ServiceEditPage'

interface Props {
  params: Promise<{ adminSlug: string; id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <ServiceEditPage serviceId={id} />
}
