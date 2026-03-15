'use client'

import { useState, useEffect } from 'react'
import styles from './SettingsPage.module.css'

const SECTIONS = ['Контакты', 'Реквизиты', 'Карта', 'Социальные сети'] as const
type Section = (typeof SECTIONS)[number]

const SECTION_META: Record<Section, { desc: string; pages: string }> = {
  Контакты: {
    desc: 'Телефоны, email, адрес и часы работы',
    pages: 'Главная (/), Контакты (/contacts), Подвал сайта',
  },
  Реквизиты: {
    desc: 'ИНН, ОГРН, банковские реквизиты',
    pages: 'Контакты (/contacts)',
  },
  Карта: {
    desc: 'Местоположение объекта на карте',
    pages: 'Контакты (/contacts)',
  },
  'Социальные сети': {
    desc: 'Ссылки на соцсети и мессенджеры',
    pages: 'Главная (/), Подвал сайта',
  },
}

// Flat settings state - each key maps directly to SiteSettings.key
type SettingsMap = Record<string, string>

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('Контакты')
  const [settings, setSettings] = useState<SettingsMap>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: SettingsMap) => setSettings(data))
  }, [])

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Настройки</h1>
          <p className={styles.subtitle}>Контактная информация и параметры сайта</p>
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
                label="Телефон аренды"
                placeholder="+7 (383) 217-72-24"
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

          {activeSection === 'Реквизиты' && (
            <div className={styles.form}>
              <FieldRow>
                <Field label="ИНН" value={settings['inn'] ?? ''} onChange={(v) => set('inn', v)} />
                <Field label="КПП" value={settings['kpp'] ?? ''} onChange={(v) => set('kpp', v)} />
              </FieldRow>
              <Field label="ОГРН" value={settings['ogrn'] ?? ''} onChange={(v) => set('ogrn', v)} />
              <Field
                label="Наименование организации"
                value={settings['orgName'] ?? ''}
                onChange={(v) => set('orgName', v)}
              />
              <Field
                label="Расчётный счёт"
                value={settings['bankAccount'] ?? ''}
                onChange={(v) => set('bankAccount', v)}
              />
              <Field
                label="Банк"
                value={settings['bankName'] ?? ''}
                onChange={(v) => set('bankName', v)}
              />
              <FieldRow>
                <Field
                  label="БИК"
                  value={settings['bankBik'] ?? ''}
                  onChange={(v) => set('bankBik', v)}
                />
                <Field
                  label="К/с"
                  value={settings['bankKs'] ?? ''}
                  onChange={(v) => set('bankKs', v)}
                />
              </FieldRow>
              <Field
                label="Директор"
                value={settings['director'] ?? ''}
                onChange={(v) => set('director', v)}
              />
            </div>
          )}

          {activeSection === 'Карта' && (
            <div className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Провайдер карты</label>
                <select
                  className={styles.fieldSelect}
                  value={settings['mapProvider'] ?? 'yandex'}
                  onChange={(e) => set('mapProvider', e.target.value)}
                >
                  <option value="yandex">Яндекс.Карты</option>
                  <option value="2gis">2ГИС</option>
                </select>
              </div>
              <FieldRow>
                <Field
                  label="Широта"
                  value={settings['mapLat'] ?? ''}
                  onChange={(v) => set('mapLat', v)}
                />
                <Field
                  label="Долгота"
                  value={settings['mapLng'] ?? ''}
                  onChange={(v) => set('mapLng', v)}
                />
              </FieldRow>
              <Field
                label="Зум"
                type="number"
                value={settings['mapZoom'] ?? ''}
                onChange={(v) => set('mapZoom', v)}
              />
              <div className={styles.mapPreview}>
                <div className={styles.mapPlaceholder}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Превью карты появится после сохранения</span>
                </div>
              </div>
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
                placeholder="+7..."
                value={settings['socialWa'] ?? ''}
                onChange={(v) => set('socialWa', v)}
              />
              <Field
                label="Avito"
                placeholder="https://avito.ru/..."
                value={settings['socialAvito'] ?? ''}
                onChange={(v) => set('socialAvito', v)}
              />
            </div>
          )}
        </div>
      </div>

      {saved && <div className={styles.toast}>✓ Настройки сохранены</div>}
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

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className={styles.fieldRow}>{children}</div>
}
