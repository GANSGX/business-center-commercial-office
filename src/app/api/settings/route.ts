import { NextResponse } from 'next/server'

const MOCK_SETTINGS = {
  phones: '+7 (383) 000-00-00',
  email: 'info@kommunisticheskaya35.ru',
  address: 'г. Новосибирск, ул. Коммунистическая, 35',
  workHours: 'Пн–Пт: 9:00–18:00',
  socials: '{}',
  mapProvider: 'yandex',
  mapLat: '54.9736',
  mapLng: '82.9282',
  mapZoom: '16',
  transport: '',
  requisites: '',
}

export async function GET() {
  return NextResponse.json(MOCK_SETTINGS, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Not available in demo' }, { status: 503 })
}
