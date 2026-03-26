import { NextResponse } from 'next/server'

const MOCK_SETTINGS = {
  phone1: '+7 (383) 223-43-50',
  phone2: '+7 (383) 217-80-07',
  email: 'kommunist35@mail.ru',
  address: '630007, г. Новосибирск, ул. Коммунистическая, 35',
  workHours: '8:00–20:00, без выходных',
  workHoursAdmin: '8:00–16:30, без выходных',
  socials: '{}',
  mapProvider: 'yandex',
  mapLat: '55.030456',
  mapLng: '82.919659',
  mapZoom: '17',
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
