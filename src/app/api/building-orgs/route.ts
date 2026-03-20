import { NextResponse } from 'next/server'
import { MOCK_BUILDING_ORGS } from '@/shared/lib/mock-data'
export async function GET() {
  return NextResponse.json(MOCK_BUILDING_ORGS)
}
export async function POST() {
  return NextResponse.json({ error: 'demo' }, { status: 503 })
}
export async function PUT() {
  return NextResponse.json({ error: 'demo' }, { status: 503 })
}
export async function DELETE() {
  return NextResponse.json({ error: 'demo' }, { status: 503 })
}
