'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLeadModal } from '@/features/lead-submit'
import { formatFloorLabel, formatFloorValue, type Room } from '@/entities/room'
import styles from './RoomCard.module.css'

// Короткие метки для бейджа на фото — не залезают на "X этаж"
const STATUS_LABEL: Record<Room['status'], string> = {
  FREE: 'Свободен',
  RESERVED: 'Бронь',
  RENTED: 'Занят',
}

const STATUS_CLASS: Record<Room['status'], string> = {
  FREE: styles.badgeFree,
  RESERVED: styles.badgeReserved,
  RENTED: styles.badgeRented,
}

const CTA_LABEL: Record<Room['status'], string> = {
  FREE: 'Оставить заявку',
  RESERVED: 'Раннее бронирование',
  RENTED: 'Уточнить наличие',
}

function formatPrice(price: number) {
  return price.toLocaleString('ru-RU') + '\u00a0₽/мес'
}

function formatArea(area: number) {
  return area.toFixed(1).replace('.', ',') + '\u00a0м²'
}

interface Props {
  room: Room
  priority?: boolean
}

export function RoomCard({ room, priority = false }: Props) {
  const { open } = useLeadModal()
  const photo = room.photos[0]
  const floorLabel = formatFloorLabel(room.floor)

  return (
    <article
      className={`${styles.card} ${room.status === 'RENTED' ? styles.cardRented : ''}`}
      aria-label={`${room.title}, ${formatArea(room.area)}, ${floorLabel}`}
    >
      {/* ── Фото ── */}
      <Link
        href={`/offices/${room.slug}`}
        className={styles.photoWrap}
        tabIndex={-1}
        aria-hidden="true"
      >
        {photo ? (
          <Image
            src={photo.url}
            alt={room.title}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 320px"
            className={styles.photo}
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
          />
        ) : (
          <div className={styles.photoPlaceholder} aria-hidden="true" />
        )}
        <span className={`${styles.statusBadge} ${STATUS_CLASS[room.status]}`}>
          {STATUS_LABEL[room.status]}
        </span>
        <span className={styles.floorBadge}>{floorLabel}</span>
      </Link>

      {/* ── Тело ── */}
      <div className={styles.body}>
        <Link href={`/offices/${room.slug}`} className={styles.title}>
          {room.title}
          {room.type ? ` — ${room.type}` : ''}
        </Link>

        <dl className={styles.details}>
          <div className={styles.row}>
            <dt className={styles.label}>Площадь</dt>
            <dd className={styles.value}>{formatArea(room.area)}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.label}>Корпус</dt>
            <dd className={styles.value}>{room.buildingNumber ?? 'Не указано'}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.label}>Этаж</dt>
            <dd className={styles.value}>{formatFloorValue(room.floor)}</dd>
          </div>
          {room.layoutType && (
            <div className={styles.row}>
              <dt className={styles.label}>Планировка</dt>
              <dd className={styles.value}>{room.layoutType}</dd>
            </div>
          )}
          {room.rentType && (
            <div className={styles.row}>
              <dt className={styles.label}>Тип аренды</dt>
              <dd className={styles.value}>{room.rentType}</dd>
            </div>
          )}
          {room.minRentTerm && (
            <div className={styles.row}>
              <dt className={styles.label}>Мин. срок</dt>
              <dd className={styles.value}>{room.minRentTerm}</dd>
            </div>
          )}
          <div className={styles.row}>
            <dt className={styles.label}>Особенности</dt>
            <dd className={styles.value}>
              {[room.windows && 'Окна', room.water && 'Вода', room.wc && 'Санузел']
                .filter(Boolean)
                .join(', ') || 'Стандарт'}
            </dd>
          </div>
        </dl>

        <div className={styles.footer}>
          {!room.hidePrice && (
            <div className={styles.priceWrap}>
              <span className={styles.priceLabel}>от</span>
              <span className={styles.price}>{formatPrice(room.priceMonth)}</span>
              {room.priceM2 && (
                <span
                  className={styles.priceM2}
                >{`${room.priceM2.toLocaleString('ru-RU')}\u00a0₽/м²`}</span>
              )}
            </div>
          )}
          <button
            type="button"
            className={`${styles.cta} ${room.status === 'RENTED' ? styles.ctaRented : ''}`}
            onClick={() => open(`${room.title}, ${formatArea(room.area)}`)}
            aria-label={`${CTA_LABEL[room.status]} — ${room.title}`}
          >
            {CTA_LABEL[room.status]}
          </button>
        </div>
      </div>
    </article>
  )
}
