import { NextResponse } from 'next/server'
import { MOCK_ROOM } from '@/shared/lib/mock-data'

export async function GET() {
  return NextResponse.json(MOCK_ROOM)
}

export async function PUT() {
  return NextResponse.json({ error: 'Not available in demo' }, { status: 503 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Not available in demo' }, { status: 503 })
}
