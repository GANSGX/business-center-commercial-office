import dynamic from 'next/dynamic'

const RoomEditPage = dynamic(() => import('./_page/RoomEditPage').then((m) => m.RoomEditPage), {
  ssr: false,
})

interface Props {
  params: Promise<{ adminSlug: string; id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <RoomEditPage roomId={id} />
}
