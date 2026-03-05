import styles from './Tenants.module.css'

// TODO Sprint 1 S1-D2-03: заменить на данные из /api/tenants
const TENANTS = [
  {
    id: '1',
    name: 'СибТехноПарк',
    color: 'blue',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
      </svg>
    ),
  },
  {
    id: '2',
    name: 'МегаФон',
    color: 'green',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="2" width="14" height="20" rx="3" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    id: '3',
    name: 'Ростелеком',
    color: 'amber',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1.5 8.5a13 13 0 0 1 21 0" />
        <path d="M5 12a9 9 0 0 1 14 0" />
        <path d="M8.5 15.5a5 5 0 0 1 7 0" />
        <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: '4',
    name: 'S7 Airlines',
    color: 'teal',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 21 4s-2 0-3.5 1.5L14 9 5.8 7.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 1 1 3 1-1v-3l3-2 3.5 3.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
      </svg>
    ),
  },
  {
    id: '5',
    name: 'ЗапСибБанк',
    color: 'purple',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7" />
        <path d="M3 9v11h18V9" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    id: '6',
    name: 'GS Group',
    color: 'red',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-4 0v2" />
        <line x1="8" y1="12" x2="8" y2="16" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="16" y1="12" x2="16" y2="16" />
      </svg>
    ),
  },
  {
    id: '7',
    name: 'НГУ-Инкубатор',
    color: 'indigo',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6H8.3C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z" />
      </svg>
    ),
  },
  {
    id: '8',
    name: 'СибУголь',
    color: 'orange',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 20h20" />
        <path d="M5 20V8l7-5 7 5v12" />
        <path d="M10 20v-5h4v5" />
      </svg>
    ),
  },
  {
    id: '9',
    name: 'Авангард',
    color: 'teal',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3L4 7v5c0 5.25 4.5 9 8 9s8-3.75 8-9V7l-8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: '10',
    name: 'ТехноГрупп',
    color: 'blue',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: '11',
    name: 'СибБизнес',
    color: 'amber',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 4-4" />
      </svg>
    ),
  },
  {
    id: '12',
    name: 'Новасиб',
    color: 'green',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-4h6v4" />
      </svg>
    ),
  },
]

const ROW_1 = TENANTS.slice(0, 6)
const ROW_2 = TENANTS.slice(6)

function LogoCard({ tenant }: { tenant: (typeof TENANTS)[number] }) {
  return (
    <div className={`${styles.logo} ${styles[`color_${tenant.color}`]}`}>
      <span className={styles.logoMark}>{tenant.icon}</span>
      <span className={styles.logoName}>{tenant.name}</span>
    </div>
  )
}

export function Tenants() {
  return (
    <section className={styles.section} aria-labelledby="tenants-title">
      {/* Шапка */}
      <div className={styles.head}>
        <span className={styles.label}>Нам доверяют</span>
        <h2 className={styles.title} id="tenants-title">
          Наши арендаторы
        </h2>
        <p className={styles.subtitle}>Ведущие компании Новосибирска выбирают «На Октябрьской»</p>
      </div>

      {/* Маркиз-зона — overflow hidden и fade только здесь */}
      <div className={styles.marqueeArea}>
        {/* Ряд 1 — скроллит влево */}
        <div className={styles.marqueeWrap} aria-hidden="true">
          <div className={`${styles.marqueeTrack} ${styles.trackLeft}`}>
            {[...ROW_1, ...ROW_1].map((t, i) => (
              <LogoCard key={`r1-${t.id}-${i}`} tenant={t} />
            ))}
          </div>
        </div>

        {/* Ряд 2 — скроллит вправо */}
        <div className={styles.marqueeWrap} aria-hidden="true">
          <div className={`${styles.marqueeTrack} ${styles.trackRight}`}>
            {[...ROW_2, ...ROW_2].map((t, i) => (
              <LogoCard key={`r2-${t.id}-${i}`} tenant={t} />
            ))}
          </div>
        </div>

        {/* Edge fade — только над маркизом */}
        <div className={styles.fadeLeft} aria-hidden="true" />
        <div className={styles.fadeRight} aria-hidden="true" />
      </div>
    </section>
  )
}
