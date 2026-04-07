import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM ?? 'onboarding@resend.dev'
const TO = process.env.EMAIL_TO ?? ''

// ── Типы ─────────────────────────────────────────────────────────────────────

export interface LeadEmailData {
  name: string
  phone: string
  email?: string | null
  message?: string | null
  roomId?: string | null
  serviceName?: string | null
  pageUrl?: string | null
}

export interface TenantRequestEmailData {
  companyName: string
  category: string
  floor?: number | null
  description?: string | null
  contactName: string
  phone: string
  email?: string | null
}

// ── Категории арендаторов ─────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Питание / кафе',
  service: 'Услуги',
  retail: 'Розничная торговля',
  bank: 'Банк / финансы',
  other: 'Другое',
}

// ── HTML-шаблоны ──────────────────────────────────────────────────────────────

function leadHtml(data: LeadEmailData): string {
  const rows = [
    ['Имя', data.name],
    ['Телефон', `<a href="tel:${data.phone}" style="color:#8b5523">${data.phone}</a>`],
    data.email
      ? ['Email', `<a href="mailto:${data.email}" style="color:#8b5523">${data.email}</a>`]
      : null,
    data.serviceName ? ['Услуга', data.serviceName] : null,
    data.roomId ? ['ID помещения', data.roomId] : null,
    data.pageUrl ? ['Страница', data.pageUrl] : null,
    data.message ? ['Сообщение', data.message] : null,
  ]
    .filter(Boolean)
    .map(
      (r) =>
        `<tr>
          <td style="padding:8px 12px;background:#f7f3ef;font-weight:600;white-space:nowrap;border-bottom:1px solid #e8ddd4">${r![0]}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8ddd4">${r![1]}</td>
        </tr>`
    )
    .join('')

  return baseLayout(
    'Новая заявка с сайта',
    `
    <p style="margin:0 0 20px;font-size:16px;color:#3d2b1f">Поступила новая заявка на аренду помещения.</p>
    <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e8ddd4">
      ${rows}
    </table>
  `
  )
}

function tenantRequestHtml(data: TenantRequestEmailData): string {
  const rows = [
    ['Компания', data.companyName],
    ['Категория', CATEGORY_LABELS[data.category] ?? data.category],
    data.floor != null ? ['Предпочтительный этаж', String(data.floor)] : null,
    ['Контактное лицо', data.contactName],
    ['Телефон', `<a href="tel:${data.phone}" style="color:#8b5523">${data.phone}</a>`],
    data.email
      ? ['Email', `<a href="mailto:${data.email}" style="color:#8b5523">${data.email}</a>`]
      : null,
    data.description ? ['Описание', data.description] : null,
  ]
    .filter(Boolean)
    .map(
      (r) =>
        `<tr>
          <td style="padding:8px 12px;background:#f7f3ef;font-weight:600;white-space:nowrap;border-bottom:1px solid #e8ddd4">${r![0]}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8ddd4">${r![1]}</td>
        </tr>`
    )
    .join('')

  return baseLayout(
    'Новый запрос на размещение в здании',
    `
    <p style="margin:0 0 20px;font-size:16px;color:#3d2b1f">Компания хочет разместить бизнес в здании БЦ.</p>
    <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e8ddd4">
      ${rows}
    </table>
  `
  )
}

function baseLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr>
          <td style="background:#8b5523;padding:24px 32px;border-radius:12px 12px 0 0">
            <p style="margin:0;font-size:13px;color:#f2e8dc;letter-spacing:1px;text-transform:uppercase">Бизнес-центр</p>
            <h1 style="margin:4px 0 0;font-size:20px;color:#ffffff;font-weight:700">Коммунистическая, 35</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-left:1px solid #e8ddd4;border-right:1px solid #e8ddd4">
            <h2 style="margin:0 0 24px;font-size:20px;color:#3d2b1f">${title}</h2>
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7f3ef;padding:16px 32px;border:1px solid #e8ddd4;border-top:none;border-radius:0 0 12px 12px">
            <p style="margin:0;font-size:12px;color:#7a6a5a">
              Это автоматическое уведомление. Перейти в
              <a href="${process.env.NEXTAUTH_URL ?? ''}" style="color:#8b5523">админ-панель</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Публичные функции ─────────────────────────────────────────────────────────

export async function sendLeadNotification(data: LeadEmailData): Promise<void> {
  if (!TO) {
    console.warn('[email] EMAIL_TO не задан — уведомление не отправлено')
    return
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Новая заявка — ${data.name} (${data.phone})`,
    html: leadHtml(data),
  })

  if (error) {
    console.error('[email] Ошибка отправки заявки:', error)
  }
}

export async function sendTenantRequestNotification(data: TenantRequestEmailData): Promise<void> {
  if (!TO) {
    console.warn('[email] EMAIL_TO не задан — уведомление не отправлено')
    return
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Запрос на размещение — ${data.companyName} (${data.contactName})`,
    html: tenantRequestHtml(data),
  })

  if (error) {
    console.error('[email] Ошибка отправки запроса арендатора:', error)
  }
}
