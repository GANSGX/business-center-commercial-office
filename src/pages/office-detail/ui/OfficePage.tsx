import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/shared/ui'
import type { Room, RoomStatus } from '@/entities/room'
import { OfficeCtaButton } from './OfficeCtaButton'
import styles from './OfficePage.module.css'

interface Props {
  room: Room
}

function toStatus(s: RoomStatus): 'free' | 'reserved' | 'rented' {
  return s.toLowerCase() as 'free' | 'reserved' | 'rented'
}

function formatPrice(n: number) {
  return n.toLocaleString('ru-RU') + '\u00a0₽/мес'
}

function formatArea(n: number) {
  return n.toFixed(1).replace('.', ',') + '\u00a0м²'
}

interface SpecRowProps {
  label: string
  value: string
}

function SpecRow({ label, value }: SpecRowProps) {
  return (
    <>
      <dt className={styles.specTerm}>{label}</dt>
      <dd className={styles.specValue}>{value}</dd>
    </>
  )
}

export function OfficePage({ room }: Props) {
  const statusLabel = { FREE: 'Свободен', RESERVED: 'Забронирован', RENTED: 'Сдан' }[room.status]

  return (
    <div className={styles.page}>
      {/* ── Breadcrumb ── */}
      <nav className={styles.breadcrumbNav} aria-label="Хлебные крошки">
        <ol className={styles.breadcrumbList}>
          <li>
            <Link href="/">Главная</Link>
          </li>
          <li>
            <Link href="/offices">Аренда офисов</Link>
          </li>
          <li aria-current="page">{room.title}</li>
        </ol>
      </nav>

      {/* ── Фото / Hero ── */}
      <div className={styles.photoSection} aria-label="Фотографии офиса">
        {room.photos.length > 0 ? (
          <Image
            src={room.photos[0].url}
            alt={`${room.title} — фото`}
            fill
            className={styles.photoImg}
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        ) : (
          <div className={styles.photoPlaceholder} aria-hidden="true">
            <svg
              width="48"
              height="48"
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
            <span>Фотографии появятся после публикации</span>
          </div>
        )}
        <div className={styles.photoBadges}>
          <Badge status={toStatus(room.status)} />
          <span className={styles.floorTag}>{room.floor}&thinsp;этаж</span>
        </div>
      </div>

      {/* ── Основной контент ── */}
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ── Левая колонка ── */}
          <div className={styles.main}>
            <h1 className={styles.title}>{room.title}</h1>

            {/* Характеристики */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Характеристики</h2>
              <dl className={styles.specs}>
                {room.roomNumber && <SpecRow label="Номер офиса" value={room.roomNumber} />}
                {room.type && <SpecRow label="Тип" value={room.type} />}
                <SpecRow label="Площадь" value={formatArea(room.area)} />
                <SpecRow label="Этаж" value={String(room.floor)} />
                {room.layoutType && <SpecRow label="Планировка" value={room.layoutType} />}
                <SpecRow label="Вода в офисе" value={room.water ? 'Есть' : 'Нет'} />
                <SpecRow label="Санузел" value={room.wc ? 'Есть' : 'Нет'} />
                <SpecRow label="Окна" value={room.windows ? 'Есть' : 'Нет'} />
                {room.entrance && <SpecRow label="Вход" value={room.entrance} />}
                {room.rentType && <SpecRow label="Тип аренды" value={room.rentType} />}
                {room.internet && <SpecRow label="Интернет" value={room.internet} />}
                {room.minRentTerm && <SpecRow label="Мин. срок аренды" value={room.minRentTerm} />}
                <SpecRow label="Статус" value={statusLabel} />
              </dl>
            </section>

            {/* Описание */}
            {room.description && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Описание</h2>
                {/* TODO Sprint 2: sanitize HTML через sanitize-html перед рендером */}
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: room.description }}
                />
              </section>
            )}

            {/* Подходит для */}
            {room.suitableFor.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Подходит для</h2>
                <ul className={styles.tags} aria-label="Типы бизнеса">
                  {room.suitableFor.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* ── Боковая панель ── */}
          <aside className={styles.sidebar} aria-label="Условия аренды">
            <div className={styles.sidebarCard}>
              <div className={styles.priceBlock}>
                <span className={styles.priceValue}>{formatPrice(room.priceMonth)}</span>
                {room.priceM2 && (
                  <span className={styles.priceM2}>{Math.round(room.priceM2)}&thinsp;₽/м²</span>
                )}
              </div>

              <div className={styles.sidebarBadge}>
                <Badge status={toStatus(room.status)} />
              </div>

              {room.status !== 'RENTED' && <OfficeCtaButton />}

              {room.status === 'RENTED' && <OfficeCtaButton label="Уточнить наличие" />}

              <dl className={styles.sidebarSpecs}>
                <div className={styles.sidebarSpecRow}>
                  <dt>Площадь</dt>
                  <dd>{formatArea(room.area)}</dd>
                </div>
                <div className={styles.sidebarSpecRow}>
                  <dt>Этаж</dt>
                  <dd>{room.floor}</dd>
                </div>
                {room.layoutType && (
                  <div className={styles.sidebarSpecRow}>
                    <dt>Планировка</dt>
                    <dd>{room.layoutType}</dd>
                  </div>
                )}
                {room.minRentTerm && (
                  <div className={styles.sidebarSpecRow}>
                    <dt>Мин. срок</dt>
                    <dd>{room.minRentTerm}</dd>
                  </div>
                )}
              </dl>

              <p className={styles.sidebarNote}>
                Бесплатный просмотр помещения в любой рабочий день
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
