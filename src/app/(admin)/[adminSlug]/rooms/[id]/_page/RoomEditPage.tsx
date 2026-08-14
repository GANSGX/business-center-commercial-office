'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import styles from './RoomEditPage.module.css'

const TiptapEditor = dynamic(() => import('./_components/TiptapEditor'), { ssr: false })

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  }
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Photo {
  id: string
  url: string
  order: number
}

interface PendingPhoto {
  tempId: string
  file: File
  previewUrl: string
}

interface FormData {
  title: string
  slug: string
  buildingNumber: string
  roomNumber: string
  type: string
  status: string
  area: string
  floor: string
  priceMonth: string
  priceM2: string
  hidePrice: boolean
  layoutType: string
  internet: string
  entrance: string
  rentType: string
  minRentTerm: string
  suitableFor: string
  water: boolean
  wc: boolean
  windows: boolean
  showOnHome: boolean
  description: string
}

const EMPTY_FORM: FormData = {
  title: '',
  slug: '',
  buildingNumber: '',
  roomNumber: '',
  type: 'Офис',
  status: 'FREE',
  area: '',
  floor: '',
  priceMonth: '',
  priceM2: '',
  hidePrice: false,
  layoutType: 'Открытая',
  internet: 'Оптоволокно',
  entrance: 'Главный',
  rentType: 'Долгосрочная',
  minRentTerm: '',
  suitableFor: '',
  water: false,
  wc: false,
  windows: false,
  showOnHome: false,
  description: '',
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RoomEditPage({ roomId }: { roomId?: string }) {
  const isNew = !roomId || roomId === 'new'
  const router = useRouter()
  const params = useParams()
  const adminSlug = params.adminSlug as string

  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  // Load existing room
  useEffect(() => {
    if (isNew) return
    fetch(`/api/rooms/${roomId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          setError('Помещение не найдено')
          return
        }
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          buildingNumber: data.buildingNumber ?? '',
          roomNumber: data.roomNumber ?? '',
          type: data.type ?? 'Офис',
          status: data.status ?? 'FREE',
          area: data.area?.toString() ?? '',
          floor: data.floor?.toString() ?? '',
          priceMonth: data.priceMonth?.toString() ?? '',
          priceM2: data.priceM2?.toString() ?? '',
          hidePrice: data.hidePrice ?? false,
          layoutType: data.layoutType ?? 'Открытая',
          internet: data.internet ?? 'Оптоволокно',
          entrance: data.entrance ?? 'Главный',
          rentType: data.rentType ?? 'Долгосрочная',
          minRentTerm: data.minRentTerm ?? '',
          suitableFor: data.suitableFor?.join(', ') ?? '',
          water: data.water ?? false,
          wc: data.wc ?? false,
          windows: data.windows ?? false,
          showOnHome: data.showOnHome ?? false,
          description: data.description ?? '',
        })
        setPhotos(data.photos ?? [])
      })
      .finally(() => setLoading(false))
  }, [isNew, roomId])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setError('')
    if (!form.title.trim()) {
      setError('Укажите название помещения')
      return
    }
    if (!form.area || !form.floor || !form.priceMonth) {
      setError('Заполните площадь, этаж и цену')
      return
    }

    setSaving(true)
    const payload = {
      title: form.title.trim(),
      slug: isNew ? toSlug(form.title.trim()) || `room-${Date.now()}` : form.slug,
      buildingNumber: form.buildingNumber.trim() ? form.buildingNumber.trim() : null,
      roomNumber: form.roomNumber || undefined,
      type: form.type || undefined,
      status: form.status,
      area: parseFloat(form.area),
      floor: parseInt(form.floor),
      priceMonth: parseInt(form.priceMonth),
      priceM2: form.priceM2 ? parseFloat(form.priceM2) : undefined,
      hidePrice: form.hidePrice,
      layoutType: form.layoutType || undefined,
      internet: form.internet || undefined,
      entrance: form.entrance || undefined,
      rentType: form.rentType || undefined,
      minRentTerm: form.minRentTerm || undefined,
      suitableFor: form.suitableFor
        ? form.suitableFor
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      water: form.water,
      wc: form.wc,
      windows: form.windows,
      showOnHome: form.showOnHome,
      description: form.description || undefined,
    }

    try {
      let res: Response
      if (isNew) {
        res = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/rooms', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: roomId, ...payload }),
        })
      }

      const data = await res.json()
      if (!res.ok) {
        setError(
          data.error?.fieldErrors
            ? JSON.stringify(data.error.fieldErrors)
            : (data.error ?? 'Ошибка сохранения')
        )
        return
      }

      if (isNew) {
        // Загружаем pending фото после создания
        if (pendingPhotos.length > 0) {
          for (const pending of pendingPhotos) {
            const fd = new FormData()
            fd.append('file', pending.file)
            await fetch(`/api/rooms/${data.id}/photos`, { method: 'POST', body: fd })
            URL.revokeObjectURL(pending.previewUrl)
          }
        }
        router.refresh()
        router.push(`/${adminSlug}/rooms/${data.id}`)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } catch {
      setError('Ошибка сети')
    } finally {
      setSaving(false)
    }
  }

  async function handlePhotoUpload(files: FileList | null) {
    if (!files) return
    if (isNew) {
      const added: PendingPhoto[] = Array.from(files).map((file) => ({
        tempId: `tmp-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }))
      setPendingPhotos((prev) => [...prev, ...added])
      return
    }
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`/api/rooms/${roomId}/photos`, { method: 'POST', body: fd })
      if (res.ok) {
        const photo = await res.json()
        setPhotos((prev) => [...prev, photo])
      }
    }
    setUploading(false)
  }

  function handlePendingDelete(tempId: string) {
    setPendingPhotos((prev) => {
      const photo = prev.find((p) => p.tempId === tempId)
      if (photo) URL.revokeObjectURL(photo.previewUrl)
      return prev.filter((p) => p.tempId !== tempId)
    })
  }

  function handlePendingSetMain(tempId: string) {
    setPendingPhotos((prev) => {
      const idx = prev.findIndex((p) => p.tempId === tempId)
      if (idx <= 0) return prev
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      next.unshift(item)
      return next
    })
  }

  async function handleSetMain(photoId: string) {
    const ids = [photoId, ...photos.filter((p) => p.id !== photoId).map((p) => p.id)]
    const res = await fetch(`/api/rooms/${roomId}/photos/order`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    if (res.ok) {
      setPhotos((prev) => {
        const main = prev.find((p) => p.id === photoId)!
        const rest = prev.filter((p) => p.id !== photoId)
        return [main, ...rest].map((p, i) => ({ ...p, order: i }))
      })
    }
  }

  async function handlePhotoDelete(photoId: string) {
    const res = await fetch(`/api/rooms/${roomId}/photos/${photoId}`, { method: 'DELETE' })
    if (res.ok) setPhotos((prev) => prev.filter((p) => p.id !== photoId))
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <a className={styles.breadcrumbLink} href={`/${adminSlug}/rooms`}>
            Помещения
          </a>
          <span className={styles.breadcrumbSep}>/</span>
          <span>{isNew ? 'Новое помещение' : form.title || 'Редактирование'}</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.cancelBtn}
            type="button"
            onClick={() => router.push(`/${adminSlug}/rooms`)}
          >
            Отмена
          </button>
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
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.layout}>
        {/* Основная форма */}
        <div className={styles.main}>
          {/* Основная информация */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Основное</h2>
            <div className={styles.form}>
              <FieldRow>
                <Field
                  label="Название *"
                  placeholder="Офис №35А"
                  value={form.title}
                  onChange={(v) => set('title', v)}
                />
                <Field
                  label="Номер помещения"
                  placeholder="35А"
                  value={form.roomNumber}
                  onChange={(v) => set('roomNumber', v)}
                />
              </FieldRow>
              <FieldRow>
                <Select label="Тип помещения" value={form.type} onChange={(v) => set('type', v)}>
                  <option value="Офис">Офис</option>
                  <option value="Склад">Склад / Производство</option>
                  <option value="Торговое">Торговое</option>
                </Select>
                <Select label="Статус" value={form.status} onChange={(v) => set('status', v)}>
                  <option value="FREE">Свободно</option>
                  <option value="RESERVED">Забронировано</option>
                  <option value="RENTED">Занято</option>
                </Select>
              </FieldRow>
              <FieldRow>
                <Field
                  label="Номер корпуса"
                  placeholder="1, 2А, Б"
                  value={form.buildingNumber}
                  onChange={(v) => set('buildingNumber', v)}
                />
                <Field
                  label="Площадь, м² *"
                  type="number"
                  placeholder="45"
                  value={form.area}
                  onChange={(v) => {
                    set('area', v)
                    if (!form.hidePrice && form.priceM2 && v)
                      set(
                        'priceMonth',
                        String(Math.round(parseFloat(v) * parseFloat(form.priceM2)))
                      )
                  }}
                />
                <Field
                  label="Этаж *"
                  type="number"
                  placeholder="0 (цоколь) или 1+"
                  value={form.floor}
                  onChange={(v) => set('floor', v)}
                />
              </FieldRow>
              <div className={styles.pricePlate}>
                <FieldRow>
                  <FieldWithHint
                    label="Цена за м², ₽"
                    hint="Заполните для авторасчёта"
                    type="number"
                    placeholder="777"
                    value={form.priceM2}
                    disabled={form.hidePrice}
                    onChange={(v) => {
                      set('priceM2', v)
                      if (form.area && v)
                        set('priceMonth', String(Math.round(parseFloat(form.area) * parseFloat(v))))
                    }}
                  />
                  <FieldWithHint
                    label="Цена в месяц, ₽ *"
                    hint={
                      form.hidePrice
                        ? 'на сайте не показывается'
                        : form.priceM2 && form.area
                          ? `= ${form.area} м² × ${form.priceM2} ₽`
                          : 'можно ввести вручную'
                    }
                    type="number"
                    placeholder="35 000"
                    value={form.priceMonth}
                    disabled={form.hidePrice}
                    onChange={(v) => set('priceMonth', v)}
                  />
                </FieldRow>
                <Checkbox
                  label="Скрыть стоимость на сайте"
                  checked={form.hidePrice}
                  onChange={(v) => set('hidePrice', v)}
                />
              </div>
              <FieldRow>
                <Select
                  label="Условия аренды"
                  value={form.rentType}
                  onChange={(v) => set('rentType', v)}
                >
                  <option value="Долгосрочная">Долгосрочная</option>
                  <option value="Краткосрочная">Краткосрочная</option>
                  <option value="Любая">Любая</option>
                </Select>
                <Field
                  label="Минимальный срок"
                  placeholder="от 3 месяцев"
                  value={form.minRentTerm}
                  onChange={(v) => set('minRentTerm', v)}
                />
              </FieldRow>
            </div>
          </section>

          {/* Характеристики */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Характеристики</h2>
            <div className={styles.form}>
              <FieldRow>
                <Select
                  label="Тип планировки"
                  value={form.layoutType}
                  onChange={(v) => set('layoutType', v)}
                >
                  <option value="Открытая">Открытая (open space)</option>
                  <option value="Кабинетная">Кабинетная</option>
                  <option value="Смешанная">Смешанная</option>
                  <option value="Коворкинг">Коворкинг</option>
                  <option value="Переговорная">Переговорная комната</option>
                  <option value="Представительский">Представительский класс</option>
                  <option value="Производственная">Производственная</option>
                  <option value="Складская">Складская</option>
                </Select>
                <Select label="Интернет" value={form.internet} onChange={(v) => set('internet', v)}>
                  <option value="Оптоволокно">Оптоволокно (до 1 Гбит/с)</option>
                  <option value="Кабельный">Кабельный</option>
                  <option value="Wi-Fi">Wi-Fi в здании</option>
                  <option value="Нет">Нет</option>
                </Select>
              </FieldRow>
              <FieldRow>
                <Select label="Вход" value={form.entrance} onChange={(v) => set('entrance', v)}>
                  <option value="Главный">Главный вход</option>
                  <option value="Боковой">Боковой вход</option>
                  <option value="Отдельный">Отдельный вход с улицы</option>
                  <option value="Со двора">Со двора</option>
                </Select>
                <Field
                  label="Подходит для (через запятую)"
                  placeholder="IT-компании, юридические, медицинские"
                  value={form.suitableFor}
                  onChange={(v) => set('suitableFor', v)}
                />
              </FieldRow>
              <div className={styles.checkboxGrid}>
                <Checkbox
                  label="Водоснабжение (раковина)"
                  checked={form.water}
                  onChange={(v) => set('water', v)}
                />
                <Checkbox
                  label="Санузел (туалет/душ)"
                  checked={form.wc}
                  onChange={(v) => set('wc', v)}
                />
                <Checkbox
                  label="Окна с естественным светом"
                  checked={form.windows}
                  onChange={(v) => set('windows', v)}
                />
                <Checkbox
                  label="Показывать на главной странице"
                  checked={form.showOnHome}
                  onChange={(v) => set('showOnHome', v)}
                />
              </div>
            </div>
          </section>

          {/* Описание */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Описание</h2>
            <TiptapEditor value={form.description} onChange={(v) => set('description', v)} />
          </section>
        </div>

        {/* Сайдбар с фото */}
        <aside className={styles.aside}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Фотографии</h2>
            {isNew && (
              <p className={styles.photoHint}>Фото будут загружены после сохранения офиса</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handlePhotoUpload(e.target.files)}
            />
            <button
              type="button"
              className={styles.photoDropzone}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
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
              <span>{uploading ? 'Загрузка...' : 'Загрузить фото'}</span>
            </button>

            {/* Pending фото (новый офис до сохранения) */}
            {isNew && pendingPhotos.length > 0 && (
              <div className={styles.photoGrid}>
                {pendingPhotos.map((photo, idx) => (
                  <div
                    key={photo.tempId}
                    className={`${styles.photoItem} ${idx === 0 ? styles.photoItemMain : ''}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.previewUrl} alt={`Фото ${idx + 1}`} />
                    {idx === 0 ? (
                      <span className={styles.mainBadge}>Главное</span>
                    ) : (
                      <button
                        type="button"
                        className={styles.photoSetMainBtn}
                        onClick={() => handlePendingSetMain(photo.tempId)}
                        title="Сделать главным"
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="none"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.photoDeleteBtn}
                      onClick={() => handlePendingDelete(photo.tempId)}
                    >
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
            )}

            {/* Загруженные фото (существующий офис) */}
            {!isNew && photos.length > 0 && (
              <div className={styles.photoGrid}>
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className={`${styles.photoItem} ${idx === 0 ? styles.photoItemMain : ''}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={`Фото ${idx + 1}`} loading="lazy" />
                    {idx === 0 ? (
                      <span className={styles.mainBadge}>Главное</span>
                    ) : (
                      <button
                        type="button"
                        className={styles.photoSetMainBtn}
                        onClick={() => handleSetMain(photo.id)}
                        title="Сделать главным"
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="none"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.photoDeleteBtn}
                      onClick={() => handlePhotoDelete(photo.id)}
                    >
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
            )}
          </section>
        </aside>
      </div>

      {saved && <div className={styles.toast}>✓ Помещение сохранено</div>}
    </div>
  )
}

// ── Field helpers ─────────────────────────────────────────────────────────────

function FieldWithHint({
  label,
  hint,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
}: {
  label: string
  hint?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
  disabled?: boolean
}) {
  return (
    <div className={`${styles.fieldGroup} ${disabled ? styles.fieldGroupDisabled : ''}`}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        className={styles.fieldInput}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <span className={styles.fieldHint}>{hint}</span>}
    </div>
  )
}

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

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <select
        className={styles.fieldSelect}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  )
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className={styles.fieldRow}>{children}</div>
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className={styles.checkboxField}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
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
