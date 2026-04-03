const DEFAULTS: Record<string, string> = {
  phone1: '+7 (383) 223-43-50',
  phone2: '+7 (383) 217-80-07',
  email: 'kommunist35@mail.ru',
  address: '630007, г. Новосибирск, ул. Коммунистическая, 35',
  workHours: '08:00–20:00',
  workHoursAdmin: '08:00–16:30',
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  return DEFAULTS
}

/** Конвертирует "+7 (383) 223-43-50" → "+73832234350" для href="tel:..." */
export function toTelHref(phone: string): string {
  return 'tel:' + phone.replace(/[^\d+]/g, '')
}

/** Гарантирует абсолютный URL — добавляет https:// если протокол не указан */
export function toAbsoluteUrl(url: string): string {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return 'https://' + url
}
