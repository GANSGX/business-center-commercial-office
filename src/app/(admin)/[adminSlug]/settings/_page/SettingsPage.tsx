'use client'

import { useState } from 'react'
import styles from './SettingsPage.module.css'

const SECTIONS = ['Контакты', 'Реквизиты', 'Карта', 'Социальные сети'] as const
type Section = (typeof SECTIONS)[number]

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('Контакты')
  const [saved, setSaved] = useState(false)

  function handleSave() {
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
        <button className={styles.saveBtn} onClick={handleSave}>
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
              {s}
            </button>
          ))}
        </nav>

        {/* Форма */}
        <div className={styles.formWrap}>
          {activeSection === 'Контакты' && (
            <div className={styles.form}>
              <Field
                label="Телефон приёмной"
                placeholder="+7 (383) 223-43-50"
                defaultValue="+7 (383) 223-43-50"
              />
              <Field label="Телефон аренды" placeholder="+7 (383) 217-72-24" />
              <Field
                label="Email"
                type="email"
                placeholder="kommunist35@mail.ru"
                defaultValue="kommunist35@mail.ru"
              />
              <Field
                label="Адрес"
                placeholder="630007, г. Новосибирск, ул. Коммунистическая, 35"
                defaultValue="630007, г. Новосибирск, ул. Коммунистическая, 35"
              />
              <Field
                label="Часы работы"
                placeholder="Пн–Пт: 9:00–18:00"
                defaultValue="Пн–Пт: 9:00–18:00, Сб: 10:00–16:00"
              />
            </div>
          )}

          {activeSection === 'Реквизиты' && (
            <div className={styles.form}>
              <FieldRow>
                <Field label="ИНН" defaultValue="5406247047" />
                <Field label="КПП" defaultValue="540601001" />
              </FieldRow>
              <Field label="ОГРН" defaultValue="1035402474293" />
              <Field label="Наименование организации" defaultValue='АО "Коммунистическая-35"' />
              <Field label="Расчётный счёт" defaultValue="40702810123220000356" />
              <Field label="Банк" defaultValue='Филиал "НОВОСИБИРСКИЙ" АО "АЛЬФА-БАНК"' />
              <FieldRow>
                <Field label="БИК" defaultValue="045004774" />
                <Field label="К/с" defaultValue="30101810600000000774" />
              </FieldRow>
              <Field label="Директор" defaultValue="Усенко Виталий Владимирович" />
            </div>
          )}

          {activeSection === 'Карта' && (
            <div className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Провайдер карты</label>
                <select className={styles.fieldSelect} defaultValue="yandex">
                  <option value="yandex">Яндекс.Карты</option>
                  <option value="2gis">2ГИС</option>
                </select>
              </div>
              <FieldRow>
                <Field label="Широта" defaultValue="54.987871" />
                <Field label="Долгота" defaultValue="82.891380" />
              </FieldRow>
              <Field label="Зум" type="number" defaultValue="16" />
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
              <Field label="ВКонтакте" placeholder="https://vk.com/..." />
              <Field label="Telegram" placeholder="https://t.me/..." />
              <Field label="WhatsApp" placeholder="+7..." />
              <Field label="Avito" placeholder="https://avito.ru/..." />
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
  defaultValue,
  type = 'text',
}: {
  label: string
  placeholder?: string
  defaultValue?: string
  type?: string
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        className={styles.fieldInput}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  )
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className={styles.fieldRow}>{children}</div>
}
