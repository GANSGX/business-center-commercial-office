import { NextResponse } from 'next/server'
import { MOCK_ROOM } from '@/shared/lib/mock-data'

export async function GET() {
  return NextResponse.json({ rooms: [MOCK_ROOM], total: 1, page: 1, limit: 12, pages: 1 })
}

export async function POST() {
  return NextResponse.json({ error: 'Not available in demo' }, { status: 503 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Not available in demo' }, { status: 503 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Not available in demo' }, { status: 503 })
}
