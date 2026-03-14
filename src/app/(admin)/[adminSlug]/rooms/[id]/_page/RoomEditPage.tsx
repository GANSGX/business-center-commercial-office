'use client'

import { useState } from 'react'
import styles from './RoomEditPage.module.css'

const MOCK_PHOTOS = [
  { id: 'p1', url: 'https://picsum.photos/seed/room-edit-1/800/600' },
  { id: 'p2', url: 'https://picsum.photos/seed/room-edit-2/800/600' },
  { id: 'p3', url: 'https://picsum.photos/seed/room-edit-3/800/600' },
]

export function RoomEditPage({ roomId }: { roomId?: string }) {
  const isNew = !roomId || roomId === 'new'
  const [saved, setSaved] = useState(false)
  const [photos, setPhotos] = useState(MOCK_PHOTOS)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <a className={styles.breadcrumbLink} href="./..">
            Помещения
          </a>
          <span className={styles.breadcrumbSep}>/</span>
          <span>{isNew ? 'Новое помещение' : 'Редактирование'}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.cancelBtn} type="button">
            Отмена
          </button>
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
      </div>

      <div className={styles.layout}>
        {/* Основная форма */}
        <div className={styles.main}>
          {/* Основная информация */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Основное</h2>
            <div className={styles.form}>
              <FieldRow>
                <Field
                  label="Название помещения"
                  placeholder="Офис №35А"
                  defaultValue={isNew ? '' : 'Офис на 4 этаже'}
                />
                <Field
                  label="Номер помещения"
                  placeholder="35А"
                  defaultValue={isNew ? '' : '35А'}
                />
              </FieldRow>
              <FieldRow>
                <FieldSelect label="Тип" defaultValue="office">
                  <option value="office">Офис</option>
                  <option value="warehouse">Склад/Производство</option>
                  <option value="commercial">Торговое</option>
                </FieldSelect>
                <FieldSelect label="Статус" defaultValue="FREE">
                  <option value="FREE">Свободно</option>
                  <option value="RESERVED">Бронь</option>
                  <option value="RENTED">Занято</option>
                </FieldSelect>
              </FieldRow>
              <FieldRow>
                <Field
                  label="Площадь, м²"
                  type="number"
                  placeholder="45"
                  defaultValue={isNew ? '' : '45'}
                />
                <Field label="Этаж" type="number" placeholder="4" defaultValue={isNew ? '' : '4'} />
              </FieldRow>
              <FieldRow>
                <Field
                  label="Цена в месяц, ₽"
                  type="number"
                  placeholder="35000"
                  defaultValue={isNew ? '' : '35000'}
                />
                <Field
                  label="Цена за м², ₽"
                  type="number"
                  placeholder="777"
                  defaultValue={isNew ? '' : '777'}
                />
              </FieldRow>
              <FieldRow>
                <FieldSelect label="Тип аренды" defaultValue="long">
                  <option value="long">Долгосрочная</option>
                  <option value="short">Краткосрочная</option>
                  <option value="both">Любая</option>
                </FieldSelect>
                <Field
                  label="Мин. срок аренды"
                  placeholder="от 3 месяцев"
                  defaultValue={isNew ? '' : 'от 3 месяцев'}
                />
              </FieldRow>
              <Field
                label="Slug (URL)"
                placeholder="ofis-35a-4-etazh"
                defaultValue={isNew ? '' : 'ofis-35a-4-etazh'}
              />
            </div>
          </section>

          {/* Характеристики */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Характеристики</h2>
            <div className={styles.form}>
              <FieldRow>
                <FieldSelect label="Тип планировки" defaultValue="open">
                  <option value="open">Открытая</option>
                  <option value="cabinet">Кабинетная</option>
                  <option value="mixed">Смешанная</option>
                </FieldSelect>
                <FieldSelect label="Интернет" defaultValue="fiber">
                  <option value="fiber">Оптоволокно</option>
                  <option value="cable">Кабельный</option>
                  <option value="none">Нет</option>
                </FieldSelect>
              </FieldRow>
              <FieldRow>
                <FieldSelect label="Вход" defaultValue="main">
                  <option value="main">Главный</option>
                  <option value="side">Боковой</option>
                  <option value="separate">Отдельный</option>
                </FieldSelect>
                <Field
                  label="Подходит для"
                  placeholder="IT, юридические, медицинские..."
                  defaultValue={isNew ? '' : 'IT, консалтинг'}
                />
              </FieldRow>
              <div className={styles.checkboxGrid}>
                <CheckboxField label="Водоснабжение" defaultChecked={!isNew} />
                <CheckboxField label="Санузел" defaultChecked={!isNew} />
                <CheckboxField label="Окна" defaultChecked={!isNew} />
                <CheckboxField label="Показывать на главной" defaultChecked={false} />
              </div>
            </div>
          </section>

          {/* Описание */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Описание</h2>
            <div className={styles.editorPlaceholder}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Tiptap-редактор будет подключён при интеграции с бэкендом</span>
            </div>
          </section>
        </div>

        {/* Сайдбар с фото */}
        <aside className={styles.aside}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Фотографии</h2>
            <div className={styles.photoDropzone}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Загрузить фото</span>
            </div>
            <div className={styles.photoGrid}>
              {photos.map((photo, idx) => (
                <div key={photo.id} className={styles.photoItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={`Фото ${idx + 1}`} loading="lazy" />
                  {idx === 0 && <span className={styles.mainBadge}>Главное</span>}
                  <button className={styles.photoDeleteBtn} onClick={() => removePhoto(photo.id)}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {saved && <div className={styles.toast}>✓ Помещение сохранено</div>}
    </div>
  )
}

// ── Helpers ──

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

function FieldSelect({
  label,
  defaultValue,
  children,
}: {
  label: string
  defaultValue?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <select className={styles.fieldSelect} defaultValue={defaultValue}>
        {children}
      </select>
    </div>
  )
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className={styles.fieldRow}>{children}</div>
}

function CheckboxField({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked ?? false)
  return (
    <label className={styles.checkboxField}>
      <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
      <span className={styles.checkboxBox}>
        {checked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  )
}
