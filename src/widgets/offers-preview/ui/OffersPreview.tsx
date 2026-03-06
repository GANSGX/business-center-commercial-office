import Link from 'next/link'
import styles from './OffersPreview.module.css'

// TODO Sprint 1 S1-D2-01: заменить на данные из /api/rooms
const MOCK_OFFICES = [
  {
    id: '1',
    slug: 'office-400b-1',
    number: '400б/1',
    area: 36.0,
    floor: 4,
    layout: 'Открытая',
    hasWater: false,
    price: 25000,
  },
  {
    id: '2',
    slug: 'office-301-2',
    number: '301/2',
    area: 24.5,
    floor: 3,
    layout: 'Кабинетная',
    hasWater: true,
    price: 18000,
  },
  {
    id: '3',
    slug: 'office-502-a',
    number: '502/А',
    area: 48.0,
    floor: 5,
    layout: 'Открытая',
    hasWater: false,
    price: 34000,
  },
  {
    id: '4',
    slug: 'office-210-1',
    number: '210/1',
    area: 18.0,
    floor: 2,
    layout: 'Кабинетная',
    hasWater: true,
    price: 13500,
  },
  {
    id: '5',
    slug: 'office-601-3',
    number: '601/3',
    area: 72.0,
    floor: 6,
    layout: 'Открытая',
    hasWater: true,
    price: 52000,
  },
  {
    id: '6',
    slug: 'office-105-b',
    number: '105/Б',
    area: 15.0,
    floor: 1,
    layout: 'Кабинетная',
    hasWater: false,
    price: 11000,
  },
]

function formatPrice(price: number) {
  return price.toLocaleString('ru-RU') + '\u00a0₽/мес'
}

function formatArea(area: number) {
  return area.toFixed(1).replace('.', ',') + '\u00a0м²'
}

export function OffersPreview() {
  return (
    <section className={styles.section} id="offers">
      <div className={styles.inner}>
        {/* Шапка секции */}
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadText}>
            <span className={styles.sectionLabel}>Прямо сейчас</span>
            <h2 className={styles.sectionTitle}>Актуальные предложения</h2>
            <p className={styles.sectionSubtitle}>
              Свободные офисы в нашем бизнес-центре — выберите подходящий и оставьте заявку
            </p>
          </div>
          <Link href="/offices" className={styles.allLink}>
            Все офисы
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Сетка карточек */}
        <div className={styles.grid}>
          {MOCK_OFFICES.map((office) => (
            <article
              key={office.id}
              className={styles.card}
              aria-label={`Офис ${office.number}, ${formatArea(office.area)}, ${office.floor} этаж`}
            >
              {/* Фото */}
              <div className={styles.cardPhoto}>
                <div className={styles.photoPlaceholder} aria-hidden="true" />
                <span className={styles.statusBadge}>Свободен</span>
                <span className={styles.floorBadge}>{office.floor} этаж</span>
              </div>

              {/* Тело карточки */}
              <div className={styles.cardBody}>
                <Link href={`/offices/${office.slug}`} className={styles.cardTitle}>
                  Офис, {formatArea(office.area)}
                </Link>

                <dl className={styles.details}>
                  <div className={styles.detailRow}>
                    <dt className={styles.detailLabel}>Номер офиса</dt>
                    <dd className={styles.detailValue}>{office.number}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt className={styles.detailLabel}>Площадь</dt>
                    <dd className={styles.detailValue}>{formatArea(office.area)}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt className={styles.detailLabel}>Этаж</dt>
                    <dd className={styles.detailValue}>{office.floor}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt className={styles.detailLabel}>Планировка</dt>
                    <dd className={styles.detailValue}>{office.layout}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt className={styles.detailLabel}>Вода в офисе</dt>
                    <dd className={styles.detailValue}>{office.hasWater ? 'Есть' : 'Нет'}</dd>
                  </div>
                </dl>

                <div className={styles.cardFooter}>
                  <div className={styles.priceWrap}>
                    <span className={styles.priceLabel}>от</span>
                    <span className={styles.price}>{formatPrice(office.price)}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.ctaBtn}
                    aria-label={`Оставить заявку на офис ${office.number}`}
                  >
                    Оставить заявку
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
