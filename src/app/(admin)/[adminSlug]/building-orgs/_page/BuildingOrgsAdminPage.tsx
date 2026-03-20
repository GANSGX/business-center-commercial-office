'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './BuildingOrgsAdminPage.module.css'

interface BuildingOrg {
  id: string
  name: string
  category: string
  description: string | null
  website: string | null
  floor: number
  color: string
  order: number
  active: boolean
}

const CATEGORIES = [
  { value: 'food', label: 'Кафе и рестораны' },
  { value: 'service', label: 'Услуги и сервисы' },
  { value: 'retail', label: 'Магазины' },
  { value: 'bank', label: 'Финансы' },
  { value: 'other', label: 'Другое' },
]

const COLORS = [
  { value: 'amber', label: 'Янтарный' },
  { value: 'blue', label: 'Синий' },
  { value: 'green', label: 'Зелёный' },
  { value: 'purple', label: 'Фиолетовый' },
  { value: 'red', label: 'Красный' },
  { value: 'teal', label: 'Бирюзовый' },
  { value: 'indigo', label: 'Индиго' },
  { value: 'orange', label: 'Оранжевый' },
]

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  food: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 .55.45 1 1 1h3m0 0v5" />
    </svg>
  ),
  service: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  retail: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  bank: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  ),
  other: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
}

const EMPTY_FORM = {
  name: '',
  category: 'food',
  description: '',
  website: '',
  floor: 1,
  color: 'amber',
  order: 0,
  active: true,
}

export function BuildingOrgsAdminPage() {
  const [orgs, setOrgs] = useState<BuildingOrg[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchOrgs()
  }, [])

  async function fetchOrgs() {
    try {
      const res = await fetch('/api/building-orgs?all=1')
      const data = await res.json()
      setOrgs(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, order: orgs.length })
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function openEdit(org: BuildingOrg) {
    setEditingId(org.id)
    setForm({
      name: org.name,
      category: org.category,
      description: org.description ?? '',
      website: org.website ?? '',
      floor: org.floor,
      color: org.color,
      order: org.order,
      active: org.active,
    })
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        description: form.description || undefined,
        website: form.website || undefined,
        ...(editingId ? { id: editingId } : {}),
      }
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch('/api/building-orgs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) return
      cancelForm()
      await fetchOrgs()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Удалить «${name}»?`)) return
    setOrgs((prev) => prev.filter((o) => o.id !== id))
    await fetch('/api/building-orgs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await fetchOrgs()
  }

  async function toggleActive(org: BuildingOrg) {
    setOrgs((prev) => prev.map((o) => (o.id === org.id ? { ...o, active: !o.active } : o)))
    await fetch('/api/building-orgs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: org.id, active: !org.active }),
    })
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>В здании</h1>
          <p className={styles.subtitle}>{orgs.length} организаций</p>
        </div>
        {!showForm && (
          <button className={styles.addBtn} onClick={openCreate}>
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Добавить организацию
          </button>
        )}
      </div>

      {/* Форма */}
      {showForm && (
        <div className={styles.formCard} ref={formRef}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {editingId ? 'Редактировать организацию' : 'Новая организация'}
            </h2>
            <button className={styles.formCloseBtn} onClick={cancelForm} title="Закрыть">
              <svg
                width="18"
                height="18"
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

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Название *</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="Кафе «Бузовар»"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Категория *</label>
                <div className={styles.categoryGrid}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={`${styles.categoryBtn} ${form.category === c.value ? styles.categoryBtnActive : ''}`}
                      onClick={() => setForm((p) => ({ ...p, category: c.value }))}
                    >
                      <span className={styles.categoryBtnIcon}>{CATEGORY_ICONS[c.value]}</span>
                      <span className={styles.categoryBtnLabel}>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Описание</label>
              <textarea
                className={styles.textarea}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                placeholder="Краткое описание организации..."
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Ссылка на сайт / соцсеть</label>
              <input
                className={styles.input}
                type="url"
                value={form.website}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                placeholder="https://example.ru"
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Этаж</label>
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  max={20}
                  value={form.floor}
                  onChange={(e) => setForm((p) => ({ ...p, floor: Number(e.target.value) }))}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Цвет карточки</label>
                <div className={styles.colorGrid}>
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={`${styles.colorDotBtn} ${styles[`dot_${c.value}`]} ${form.color === c.value ? styles.colorDotBtnActive : ''}`}
                      onClick={() => setForm((p) => ({ ...p, color: c.value }))}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Порядок</label>
                <input
                  className={styles.input}
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className={styles.checkboxRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                  className={styles.checkbox}
                />
                Отображать на сайте
              </label>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={cancelForm}>
                Отмена
              </button>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Сохраняю...' : editingId ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список — скрыт когда форма открыта */}
      {!showForm && (
        <>
          {loading ? (
            <div className={styles.loadingText}>Загрузка...</div>
          ) : orgs.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Организаций пока нет. Нажмите «Добавить организацию».</p>
            </div>
          ) : (
            <div className={styles.list}>
              {orgs.map((org) => (
                <div
                  key={org.id}
                  className={`${styles.row} ${!org.active ? styles.rowInactive : ''}`}
                >
                  <div className={styles.rowMain}>
                    <span className={`${styles.rowCatIcon} ${styles[`catIcon_${org.category}`]}`}>
                      {CATEGORY_ICONS[org.category]}
                    </span>
                    <div className={`${styles.colorDot} ${styles[`dot_${org.color}`]}`} />
                    <div className={styles.rowInfo}>
                      <span className={styles.rowName}>{org.name}</span>
                      <span className={styles.rowMeta}>
                        {CATEGORIES.find((c) => c.value === org.category)?.label ?? org.category}
                        {' · '}
                        {org.floor} этаж
                        {org.website && (
                          <>
                            {' '}
                            ·{' '}
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.rowWebsiteLink}
                            >
                              сайт ↗
                            </a>
                          </>
                        )}
                      </span>
                      {org.description && <span className={styles.rowDesc}>{org.description}</span>}
                    </div>
                  </div>
                  <div className={styles.rowActions}>
                    <button
                      className={`${styles.toggleBtn} ${org.active ? styles.toggleActive : styles.toggleInactive}`}
                      onClick={() => toggleActive(org)}
                    >
                      {org.active ? 'Видна' : 'Скрыта'}
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEdit(org)}
                      title="Редактировать"
                    >
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
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(org.id, org.name)}
                      title="Удалить"
                    >
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
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
