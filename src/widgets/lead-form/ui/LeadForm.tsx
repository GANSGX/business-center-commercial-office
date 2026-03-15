'use client'

import { useState } from 'react'
import styles from './LeadForm.module.css'

interface FormFields {
  name: string
  phone: string
  email: string
  message: string
  consent: boolean
  website: string // honeypot
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const EMPTY: FormFields = {
  name: '',
  phone: '',
  email: '',
  message: '',
  consent: false,
  website: '',
}

function validate(f: FormFields) {
  const e: Partial<Record<keyof FormFields, string>> = {}
  if (!f.name.trim() || f.name.trim().length < 2) e.name = 'Введите имя (минимум 2 символа)'
  if (!f.phone.trim()) {
    e.phone = 'Введите номер телефона'
  } else if (!/^[\+7\d][\d\s\-\(\)]{7,}$/.test(f.phone.trim())) {
    e.phone = 'Введите корректный номер'
  }
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Некорректный email'
  if (f.message.length > 1000) e.message = 'Не более 1000 символов'
  if (!f.consent) e.consent = 'Необходимо ваше согласие'
  return e
}

interface LeadFormProps {
  compact?: boolean
  serviceName?: string
}

export function LeadForm({ compact = false, serviceName }: LeadFormProps) {
  const [form, setForm] = useState<FormFields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({})
  const [status, setStatus] = useState<Status>('idle')

  function set(field: keyof FormFields, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.website) return // honeypot triggered

    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setStatus('loading')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          message: form.message.trim() || undefined,
          serviceName: serviceName || undefined,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      clearTimeout(timeout)

      if (res.ok) {
        setStatus('success')
        setForm(EMPTY)
        window.dispatchEvent(new Event('lead-submitted'))
      } else if (res.status === 429) {
        setErrors({ phone: 'Слишком много заявок. Повторите через 15 минут.' })
        setStatus('idle')
      } else {
        setStatus('error')
      }
    } catch {
      clearTimeout(timeout)
      setStatus('error')
    }
  }

  const cardContent =
    status === 'success' ? (
      <div className={styles.success} role="status" aria-live="polite">
        <span className={styles.successIcon} aria-hidden="true">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <h3 className={styles.successTitle}>Заявка отправлена!</h3>
        <p className={styles.successText}>Мы свяжемся с вами в ближайшее время.</p>
        <button className={styles.resetBtn} onClick={() => setStatus('idle')}>
          Отправить ещё одну
        </button>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Honeypot — скрыто от пользователей */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => set('website', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className={styles.honeypot}
        />

        {/* Имя + Телефон */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="lf-name">
              Имя{' '}
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="lf-name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
              placeholder="Иван Петров"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'err-name' : undefined}
            />
            {errors.name && (
              <span id="err-name" className={styles.errText} role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="lf-phone">
              Телефон{' '}
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="lf-phone"
              type="tel"
              className={`${styles.input} ${errors.phone ? styles.inputErr : ''}`}
              placeholder="+7 (999) 000-00-00"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'err-phone' : undefined}
            />
            {errors.phone && (
              <span id="err-phone" className={styles.errText} role="alert">
                {errors.phone}
              </span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lf-email">
            Email <span className={styles.optional}>(по желанию)</span>
          </label>
          <input
            id="lf-email"
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
            placeholder="ivan@company.ru"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'err-email' : undefined}
          />
          {errors.email && (
            <span id="err-email" className={styles.errText} role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Сообщение */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lf-message">
            Сообщение <span className={styles.optional}>(по желанию)</span>
          </label>
          <textarea
            id="lf-message"
            className={`${styles.textarea} ${errors.message ? styles.inputErr : ''}`}
            placeholder="Расскажите, какой офис вас интересует..."
            rows={4}
            maxLength={1000}
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'err-message' : undefined}
          />
          {errors.message && (
            <span id="err-message" className={styles.errText} role="alert">
              {errors.message}
            </span>
          )}
        </div>

        {/* Согласие ПДн */}
        <div className={styles.consentWrap}>
          <label className={styles.consentLabel}>
            <input
              type="checkbox"
              className={styles.consentNative}
              checked={form.consent}
              onChange={(e) => set('consent', e.target.checked)}
              aria-required="true"
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? 'err-consent' : undefined}
            />
            <span className={styles.consentBox} aria-hidden="true" />
            <span className={styles.consentText}>
              Согласен с{' '}
              <a
                href="/privacy"
                className={styles.consentLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                политикой конфиденциальности
              </a>
            </span>
          </label>
          {errors.consent && (
            <span id="err-consent" className={styles.errText} role="alert">
              {errors.consent}
            </span>
          )}
        </div>

        {/* Ошибка сервера */}
        {status === 'error' && (
          <div className={styles.errBanner} role="alert">
            Произошла ошибка. Попробуйте позже или позвоните нам напрямую.
          </div>
        )}

        {/* Кнопка */}
        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'loading' || !form.consent}
          aria-busy={status === 'loading'}
        >
          {status === 'loading' ? (
            <span className={styles.loadingDots} aria-label="Отправляем">
              Отправляем
              <span aria-hidden="true">.</span>
              <span aria-hidden="true">.</span>
              <span aria-hidden="true">.</span>
            </span>
          ) : (
            'Отправить заявку'
          )}
        </button>
      </form>
    )

  if (compact) {
    return <div className={styles.compactWrapper}>{cardContent}</div>
  }

  return (
    <section className={styles.section} id="contact" aria-labelledby="lf-title">
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        {/* ── Левая колонка: описание ── */}
        <div className={styles.info}>
          <span className={styles.badge}>Обратная связь</span>

          <h2 className={styles.title} id="lf-title">
            Давайте обсудим
            <br />
            ваши задачи
          </h2>

          <p className={styles.desc}>
            Оставьте заявку — мы свяжемся в течение рабочего дня, ответим на вопросы и подберём
            подходящий офис.
          </p>

          <ul className={styles.perks} aria-label="Что вы получите">
            <li className={styles.perk}>
              <span className={styles.perkIcon} aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              Ответ в течение 1 рабочего дня
            </li>
            <li className={styles.perk}>
              <span className={styles.perkIcon} aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              Бесплатный просмотр помещений
            </li>
            <li className={styles.perk}>
              <span className={styles.perkIcon} aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              Помогаем с выбором и оформлением
            </li>
          </ul>
        </div>

        {/* ── Правая колонка: форма ── */}
        <div className={styles.card}>
          <div className={styles.cardGlow} aria-hidden="true" />
          {cardContent}
        </div>
      </div>
    </section>
  )
}
