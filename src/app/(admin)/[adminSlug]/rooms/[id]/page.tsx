import { RoomEditPage } from './_page/RoomEditPage'

interface Props {
  params: Promise<{ adminSlug: string; id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <RoomEditPage roomId={id} />
}
