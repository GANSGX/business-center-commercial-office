'use client'

import { useState } from 'react'
import styles from './ServiceEditPage.module.css'

interface Option {
  id: string
  label: string
  description: string
  price: string
}

const MOCK_OPTIONS: Option[] = [
  { id: 'o1', label: 'Эконом', description: '2 часа в день', price: '500 ₽/час' },
  { id: 'o2', label: 'Стандарт', description: 'До 4 часов в день', price: '400 ₽/час' },
  { id: 'o3', label: 'Безлимит', description: 'Без ограничений', price: '8 000 ₽/мес' },
]

export function ServiceEditPage({ serviceId }: { serviceId?: string }) {
  const isNew = !serviceId || serviceId === 'new'
  const [saved, setSaved] = useState(false)
  const [options, setOptions] = useState(isNew ? [] : MOCK_OPTIONS)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id))
  }

  function addOption() {
    setOptions((prev) => [...prev, { id: `o${Date.now()}`, label: '', description: '', price: '' }])
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <a className={styles.breadcrumbLink} href="./..">
            Услуги
          </a>
          <span className={styles.breadcrumbSep}>/</span>
          <span>{isNew ? 'Новая услуга' : 'Редактирование'}</span>
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
        <div className={styles.main}>
          {/* Основное */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Основное</h2>
            <div className={styles.form}>
              <Field
                label="Название услуги"
                placeholder="Переговорные комнаты"
                defaultValue={isNew ? '' : 'Переговорные комнаты'}
              />
              <Field
                label="Slug (URL)"
                placeholder="meeting-rooms"
                defaultValue={isNew ? '' : 'meeting-rooms'}
              />
              <Field
                label="Цена (текст)"
                placeholder="от 500 ₽/час"
                defaultValue={isNew ? '' : 'от 500 ₽/час'}
              />
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

          {/* SEO */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>SEO</h2>
            <div className={styles.form}>
              <Field
                label="Meta Title"
                placeholder="Переговорные комнаты — аренда в БЦ Коммунистическая 35"
                defaultValue={isNew ? '' : ''}
              />
              <Field
                label="Meta Description"
                placeholder="Аренда переговорных комнат в центре Новосибирска..."
                defaultValue={isNew ? '' : ''}
              />
            </div>
          </section>

          {/* Опции */}
          <section className={styles.section}>
            <div className={styles.optionsHeader}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                Тарифы / Опции
              </h2>
              <button className={styles.addOptionBtn} onClick={addOption}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Добавить
              </button>
            </div>
            {options.length === 0 ? (
              <p className={styles.emptyOptions}>Опции не добавлены</p>
            ) : (
              <div className={styles.optionsList}>
                {options.map((opt) => (
                  <div key={opt.id} className={styles.optionCard}>
                    <div className={styles.dragHandle}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="5" r="1" />
                        <circle cx="9" cy="12" r="1" />
                        <circle cx="9" cy="19" r="1" />
                        <circle cx="15" cy="5" r="1" />
                        <circle cx="15" cy="12" r="1" />
                        <circle cx="15" cy="19" r="1" />
                      </svg>
                    </div>
                    <div className={styles.optionFields}>
                      <input
                        className={styles.optionInput}
                        placeholder="Название тарифа"
                        defaultValue={opt.label}
                      />
                      <input
                        className={styles.optionInput}
                        placeholder="Описание"
                        defaultValue={opt.description}
                      />
                      <input
                        className={styles.optionInput}
                        placeholder="Цена"
                        defaultValue={opt.price}
                      />
                    </div>
                    <button className={styles.removeOptionBtn} onClick={() => removeOption(opt.id)}>
                      <svg
                        width="13"
                        height="13"
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
            )}
          </section>
        </div>

        {/* Aside */}
        <aside className={styles.aside}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Обложка</h2>
            <div className={styles.imageDropzone}>
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
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Загрузить изображение</span>
            </div>
          </section>
        </aside>
      </div>

      {saved && <div className={styles.toast}>✓ Услуга сохранена</div>}
    </div>
  )
}

function Field({
  label,
  placeholder,
  defaultValue,
}: {
  label: string
  placeholder?: string
  defaultValue?: string
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <input className={styles.fieldInput} placeholder={placeholder} defaultValue={defaultValue} />
    </div>
  )
}
