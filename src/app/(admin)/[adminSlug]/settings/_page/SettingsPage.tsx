'use client'

import { useState, useEffect } from 'react'
import styles from './SettingsPage.module.css'

const SECTIONS = ['Контакты', 'Социальные сети'] as const
type Section = (typeof SECTIONS)[number]

const SECTION_META: Record<Section, { desc: string; pages: string }> = {
  Контакты: {
    desc: 'Телефоны, email, адрес и часы работы',
    pages: 'Контакты (/contacts), Подвал сайта',
  },
  'Социальные сети': {
    desc: 'Ссылки на соцсети и мессенджеры — иконки автоматически появляются в подвале',
    pages: 'Подвал сайта',
  },
}

type SettingsMap = Record<string, string>

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('Контакты')
  const [settings, setSettings] = useState<SettingsMap>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: SettingsMap) => setSettings(data))
  }, [])

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setError('')
    setSaving(true)
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } else {
      setError('Ошибка сохранения. Попробуйте ещё раз.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Информация о компании</h1>
          <p className={styles.subtitle}>Контакты и ссылки на страницах сайта</p>
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saved ? (
            <>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Сохранено
            </>
          ) : saving ? (
            'Сохранение...'
          ) : (
            'Сохранить'
          )}
        </button>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.layout}>
        {/* Табы секций */}
        <nav className={styles.sectionNav}>
          {SECTIONS.map((s) => (
            <button
              key={s}
              className={`${styles.sectionTab} ${activeSection === s ? styles.sectionTabActive : ''}`}
              onClick={() => setActiveSection(s)}
            >
              <span className={styles.sectionTabName}>{s}</span>
              <span className={styles.sectionTabPages}>{SECTION_META[s].pages}</span>
            </button>
          ))}
        </nav>

        {/* Форма */}
        <div className={styles.formWrap}>
          <div className={styles.sectionInfo}>
            <p className={styles.sectionDesc}>{SECTION_META[activeSection].desc}</p>
            <p className={styles.sectionPages}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Отображается на: {SECTION_META[activeSection].pages}
            </p>
          </div>

          {activeSection === 'Контакты' && (
            <div className={styles.form}>
              <Field
                label="Телефон приёмной"
                placeholder="+7 (383) 223-43-50"
                value={settings['phone1'] ?? ''}
                onChange={(v) => set('phone1', v)}
              />
              <Field
                label="Телефон отдела аренды"
                placeholder="+7 (383) 217-80-07"
                value={settings['phone2'] ?? ''}
                onChange={(v) => set('phone2', v)}
              />
              <Field
                label="Email"
                type="email"
                placeholder="kommunist35@mail.ru"
                value={settings['email'] ?? ''}
                onChange={(v) => set('email', v)}
              />
              <Field
                label="Адрес"
                placeholder="630007, г. Новосибирск, ул. Коммунистическая, 35"
                value={settings['address'] ?? ''}
                onChange={(v) => set('address', v)}
              />
              <Field
                label="Часы работы"
                placeholder="Пн–Пт: 9:00–18:00"
                value={settings['workHours'] ?? ''}
                onChange={(v) => set('workHours', v)}
              />
            </div>
          )}

          {activeSection === 'Социальные сети' && (
            <div className={styles.form}>
              <Field
                label="ВКонтакте"
                placeholder="https://vk.com/..."
                value={settings['socialVk'] ?? ''}
                onChange={(v) => set('socialVk', v)}
              />
              <Field
                label="Telegram"
                placeholder="https://t.me/..."
                value={settings['socialTg'] ?? ''}
                onChange={(v) => set('socialTg', v)}
              />
              <Field
                label="WhatsApp"
                placeholder="+7 (9XX) XXX-XX-XX"
                value={settings['socialWa'] ?? ''}
                onChange={(v) => set('socialWa', v)}
              />
            </div>
          )}
        </div>
      </div>

      {saved && <div className={styles.toast}>✓ Сохранено</div>}
    </div>
  )
}

// ── Вспомогательные компоненты ──

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        className={styles.fieldInput}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
