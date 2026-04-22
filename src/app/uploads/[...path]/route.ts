import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const filename = path.join('/')

  if (filename.includes('..')) {
    return new NextResponse(null, { status: 400 })
  }

  const filePath = join(process.cwd(), 'public', 'uploads', filename)

  try {
    const file = await readFile(filePath)
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
