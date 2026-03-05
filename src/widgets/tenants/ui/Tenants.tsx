import styles from './Tenants.module.css'

// TODO Sprint 1 S1-D2-03: заменить на данные из /api/tenants
// Реальные компании — логотип через Google Favicon API (domain).
// Выдуманные заглушки — уникальный SVG-знак (реальных логотипов не существует).
const TENANTS = [
  {
    id: '1',
    name: 'СибТехноПарк',
    color: 'blue',
    domain: null,
    logo: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="8" y="8" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="2" />
        <rect x="12" y="12" width="8" height="8" rx="1" fill="currentColor" opacity="0.6" />
        <line
          x1="12"
          y1="4"
          x2="12"
          y2="8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="4"
          x2="20"
          y2="8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="24"
          x2="12"
          y2="28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="24"
          x2="20"
          y2="28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="4"
          y1="12"
          x2="8"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="4"
          y1="20"
          x2="8"
          y2="20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1="12"
          x2="28"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1="20"
          x2="28"
          y2="20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: '2',
    name: 'МегаФон',
    color: 'green',
    domain: 'megafon.ru',
    logo: null,
  },
  {
    id: '3',
    name: 'Ростелеком',
    color: 'amber',
    domain: 'rostelecom.ru',
    logo: null,
  },
  {
    id: '4',
    name: 'S7 Airlines',
    color: 'teal',
    domain: 's7.ru',
    logo: null,
  },
  {
    id: '5',
    name: 'ЗапСибБанк',
    color: 'purple',
    domain: null,
    logo: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M4 12L16 4L28 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="4" y="12" width="24" height="2" rx="1" fill="currentColor" />
        <rect x="7" y="14" width="4" height="10" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="14" y="14" width="4" height="10" rx="1" fill="currentColor" />
        <rect x="21" y="14" width="4" height="10" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="4" y="24" width="24" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: '6',
    name: 'GS Group',
    color: 'red',
    domain: 'gs.ru',
    logo: null,
  },
  {
    id: '7',
    name: 'НГУ-Инкубатор',
    color: 'indigo',
    domain: null,
    logo: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 6L4 12L16 18L28 12L16 6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <path
          d="M8 15V22C8 22 11 26 16 26C21 26 24 22 24 22V15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="28"
          y1="12"
          x2="28"
          y2="20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: '8',
    name: 'СибУголь',
    color: 'orange',
    domain: null,
    logo: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polygon
          points="16,4 28,26 4,26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <polygon points="16,10 22,22 10,22" fill="currentColor" fillOpacity="0.5" />
      </svg>
    ),
  },
  {
    id: '9',
    name: 'Авангард',
    color: 'teal',
    domain: null,
    logo: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 3L5 8V16C5 22 10 27 16 29C22 27 27 22 27 16V8L16 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path
          d="M11 17L16 12L21 17"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="16"
          y1="12"
          x2="16"
          y2="21"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: '10',
    name: 'ТехноГрупп',
    color: 'blue',
    domain: null,
    logo: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16 4v4M16 24v4M4 16h4M24 16h4M7.03 7.03l2.83 2.83M22.14 22.14l2.83 2.83M7.03 24.97l2.83-2.83M22.14 9.86l2.83-2.83"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: '11',
    name: 'СибБизнес',
    color: 'amber',
    domain: null,
    logo: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polyline
          points="4,24 10,16 16,19 24,9 28,12"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="22,9 28,9 28,15"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="4"
          y1="27"
          x2="28"
          y2="27"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: '12',
    name: 'Новасиб',
    color: 'green',
    domain: null,
    logo: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect
          x="12"
          y="6"
          width="8"
          height="20"
          rx="1"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <rect
          x="4"
          y="13"
          width="8"
          height="13"
          rx="1"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <rect
          x="20"
          y="10"
          width="8"
          height="16"
          rx="1"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <line
          x1="2"
          y1="26"
          x2="30"
          y2="26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="3"
          x2="16"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

const TENANTS_REV = [...TENANTS].reverse()

const ROW_1 = [...TENANTS, ...TENANTS, ...TENANTS]
const ROW_2 = [...TENANTS_REV, ...TENANTS_REV, ...TENANTS_REV]

const FAVICON_API = 'https://www.google.com/s2/favicons'

function LogoCard({ tenant }: { tenant: (typeof TENANTS)[number] }) {
  return (
    <div className={`${styles.logo} ${styles[`color_${tenant.color}`]}`} aria-hidden="true">
      <span className={styles.logoMark}>
        {tenant.domain ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${FAVICON_API}?domain=${tenant.domain}&sz=128`}
            alt={tenant.name}
            width="24"
            height="24"
            className={styles.faviconImg}
          />
        ) : (
          tenant.logo
        )}
      </span>
      <span className={styles.logoName}>{tenant.name}</span>
    </div>
  )
}

export function Tenants() {
  return (
    <section className={styles.section} aria-labelledby="tenants-title">
      <div className={styles.head}>
        <span className={styles.label}>Нам доверяют</span>
        <h2 className={styles.title} id="tenants-title">
          Наши арендаторы
        </h2>
        <p className={styles.subtitle}>Ведущие компании Новосибирска выбирают «На Октябрьской»</p>
      </div>

      <div className={styles.marqueeArea}>
        <div className={styles.marqueeWrap}>
          <div className={`${styles.marqueeTrack} ${styles.trackLeft}`}>
            {ROW_1.map((t, i) => (
              <LogoCard key={`r1-${t.id}-${i}`} tenant={t} />
            ))}
          </div>
        </div>

        <div className={styles.marqueeWrap}>
          <div className={`${styles.marqueeTrack} ${styles.trackRight}`}>
            {ROW_2.map((t, i) => (
              <LogoCard key={`r2-${t.id}-${i}`} tenant={t} />
            ))}
          </div>
        </div>

        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />
      </div>
    </section>
  )
}
