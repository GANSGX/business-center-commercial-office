'use client'

import { useState } from 'react'
import styles from './TenantPlacementForm.module.css'

interface FormFields {
  companyName: string
  category: string
  floor: string
  description: string
  contactName: string
  phone: string
  email: string
  consent: boolean
  website: string // honeypot
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const EMPTY: FormFields = {
  companyName: '',
  category: '',
  floor: '',
  description: '',
  contactName: '',
  phone: '',
  email: '',
  consent: false,
  website: '',
}

function validate(f: FormFields) {
  const e: Partial<Record<keyof FormFields, string>> = {}
  if (!f.companyName.trim() || f.companyName.trim().length < 2)
    e.companyName = 'Введите название компании'
  if (!f.category) e.category = 'Выберите категорию'
  if (!f.contactName.trim() || f.contactName.trim().length < 2)
    e.contactName = 'Введите имя контактного лица'
  if (!f.phone.trim()) {
    e.phone = 'Введите номер телефона'
  } else if (!/^[\+7\d][\d\s\-\(\)]{7,}$/.test(f.phone.trim())) {
    e.phone = 'Введите корректный номер'
  }
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Некорректный email'
  if (f.description.length > 800) e.description = 'Не более 800 символов'
  if (!f.consent) e.consent = 'Необходимо ваше согласие'
  return e
}

const CATEGORIES = [
  { value: 'food', label: 'Кафе / еда' },
  { value: 'service', label: 'Услуги / сервис' },
  { value: 'retail', label: 'Магазин / розница' },
  { value: 'bank', label: 'Банк / финансы' },
  { value: 'other', label: 'Другое' },
]

export function TenantPlacementForm() {
  const [form, setForm] = useState<FormFields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({})
  const [status, setStatus] = useState<Status>('idle')

  function set(field: keyof FormFields, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.website) return // honeypot

    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/tenant-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          category: form.category,
          floor: form.floor ? Number(form.floor) : undefined,
          description: form.description.trim() || undefined,
          contactName: form.contactName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
        }),
      })

      if (res.ok) {
        setStatus('success')
        setForm(EMPTY)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
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
        <p className={styles.successText}>
          Мы рассмотрим вашу заявку и свяжемся с вами для подтверждения размещения.
        </p>
        <button className={styles.resetBtn} onClick={() => setStatus('idle')}>
          Отправить ещё одну
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* Honeypot */}
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

      {/* Название компании + Категория */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="tp-company">
            Название компании <span className={styles.required}>*</span>
          </label>
          <input
            id="tp-company"
            type="text"
            className={`${styles.input} ${errors.companyName ? styles.inputErr : ''}`}
            placeholder="ООО «Моя компания»"
            value={form.companyName}
            onChange={(e) => set('companyName', e.target.value)}
            aria-required="true"
          />
          {errors.companyName && <span className={styles.errText}>{errors.companyName}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="tp-category">
            Категория <span className={styles.required}>*</span>
          </label>
          <select
            id="tp-category"
            className={`${styles.select} ${errors.category ? styles.inputErr : ''}`}
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            aria-required="true"
          >
            <option value="">Выберите...</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && <span className={styles.errText}>{errors.category}</span>}
        </div>
      </div>

      {/* Этаж + Описание */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="tp-floor">
            Этаж <span className={styles.optional}>(если знаете)</span>
          </label>
          <input
            id="tp-floor"
            type="number"
            min={1}
            max={50}
            className={styles.input}
            placeholder="1"
            value={form.floor}
            onChange={(e) => set('floor', e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="tp-desc">
            Чем занимаетесь <span className={styles.optional}>(кратко)</span>
          </label>
          <input
            id="tp-desc"
            type="text"
            className={styles.input}
            placeholder="Кофейня, еда навынос"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            maxLength={200}
          />
          {errors.description && <span className={styles.errText}>{errors.description}</span>}
        </div>
      </div>

      {/* Контактное лицо + Телефон */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="tp-contact">
            Контактное лицо <span className={styles.required}>*</span>
          </label>
          <input
            id="tp-contact"
            type="text"
            className={`${styles.input} ${errors.contactName ? styles.inputErr : ''}`}
            placeholder="Иван Петров"
            autoComplete="name"
            value={form.contactName}
            onChange={(e) => set('contactName', e.target.value)}
            aria-required="true"
          />
          {errors.contactName && <span className={styles.errText}>{errors.contactName}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="tp-phone">
            Телефон <span className={styles.required}>*</span>
          </label>
          <input
            id="tp-phone"
            type="tel"
            className={`${styles.input} ${errors.phone ? styles.inputErr : ''}`}
            placeholder="+7 (999) 000-00-00"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            aria-required="true"
          />
          {errors.phone && <span className={styles.errText}>{errors.phone}</span>}
        </div>
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="tp-email">
          Email <span className={styles.optional}>(по желанию)</span>
        </label>
        <input
          id="tp-email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
          placeholder="info@company.ru"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
        />
        {errors.email && <span className={styles.errText}>{errors.email}</span>}
      </div>

      {/* Согласие */}
      <div className={styles.consentWrap}>
        <label className={styles.consentLabel}>
          <input
            type="checkbox"
            className={styles.consentNative}
            checked={form.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-required="true"
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
        {errors.consent && <span className={styles.errText}>{errors.consent}</span>}
      </div>

      {status === 'error' && (
        <div className={styles.errBanner} role="alert">
          Произошла ошибка. Попробуйте позже или свяжитесь с нами напрямую.
        </div>
      )}

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
          'Подать заявку на размещение'
        )}
      </button>
    </form>
  )
}
