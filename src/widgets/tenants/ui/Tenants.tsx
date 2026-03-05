import styles from './Tenants.module.css'

// TODO Sprint 1 S1-D2-03: заменить на данные из /api/tenants
// Логотипы реальных компаний — SVG-аппроксимации фирменных знаков.
// Для заглушек — уникальные геометрические марки.
const TENANTS = [
  {
    id: '1',
    name: 'СибТехноПарк',
    color: 'blue',
    logo: (
      // Фирменный знак: микросхема — квадрат с пинами
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
    logo: (
      // МегаФон: шестиугольник + буква М — их фирменный знак с 2022 г.
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polygon
          points="16,3 27,9 27,22 16,28 5,22 5,9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 21V12L16 17L22 12V21"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: '3',
    name: 'Ростелеком',
    color: 'amber',
    logo: (
      // Ростелеком: концентрические дуги — спутниковый сигнал (их визуальный язык)
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M5 26a15 15 0 0 1 22 0"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M9 21a10 10 0 0 1 14 0"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M13 17a5 5 0 0 1 6 0"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: '4',
    name: 'S7 Airlines',
    color: 'teal',
    logo: (
      // S7: фирменный логотип — «S7» в прямоугольной рамке (их реальный стиль)
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="8" width="28" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
        <text
          x="16"
          y="21"
          textAnchor="middle"
          fontSize="12"
          fontWeight="900"
          fontFamily="Arial Black, Arial, sans-serif"
          fill="currentColor"
          letterSpacing="-0.5"
        >
          S7
        </text>
      </svg>
    ),
  },
  {
    id: '5',
    name: 'ЗапСибБанк',
    color: 'purple',
    logo: (
      // ЗапСибБанк: финансовый знак — три колонны (банк)
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
    logo: (
      // GS Group: «GS» в корпоративном стиле — буквы с округлым акцентом
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <text
          x="16"
          y="22"
          textAnchor="middle"
          fontSize="14"
          fontWeight="900"
          fontFamily="Arial Black, Arial, sans-serif"
          fill="currentColor"
          letterSpacing="1"
        >
          GS
        </text>
        <line
          x1="4"
          y1="26"
          x2="28"
          y2="26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: '7',
    name: 'НГУ-Инкубатор',
    color: 'indigo',
    logo: (
      // НГУ: академическая шапка — символ университета
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
    logo: (
      // СибУголь: кристалл/гора — добывающая промышленность
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
    logo: (
      // Авангард: стрелка-вперёд внутри щита — динамика и защита
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
    logo: (
      // ТехноГрупп: шестерня — точный машиностроительный знак
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
    logo: (
      // СибБизнес: растущий график — бизнес-рост
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
    logo: (
      // Новасиб: городской силуэт — новосибирский деловой центр
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

// Ряд 2 — зеркальный порядок для визуального разнообразия
const TENANTS_REV = [...TENANTS].reverse()

// 3 копии гарантируют заполнение любого экрана (до 4K).
// Анимируем на -33.33% (= одна копия), цикл бесшовный.
const ROW_1 = [...TENANTS, ...TENANTS, ...TENANTS]
const ROW_2 = [...TENANTS_REV, ...TENANTS_REV, ...TENANTS_REV]

function LogoCard({ tenant }: { tenant: (typeof TENANTS)[number] }) {
  return (
    <div className={`${styles.logo} ${styles[`color_${tenant.color}`]}`} aria-hidden="true">
      <span className={styles.logoMark}>{tenant.logo}</span>
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

      {/* Маркиз — overflow hidden + fade только здесь */}
      <div className={styles.marqueeArea}>
        {/* Ряд 1 — скроллит влево */}
        <div className={styles.marqueeWrap}>
          <div className={`${styles.marqueeTrack} ${styles.trackLeft}`}>
            {ROW_1.map((t, i) => (
              <LogoCard key={`r1-${t.id}-${i}`} tenant={t} />
            ))}
          </div>
        </div>

        {/* Ряд 2 — скроллит вправо */}
        <div className={styles.marqueeWrap}>
          <div className={`${styles.marqueeTrack} ${styles.trackRight}`}>
            {ROW_2.map((t, i) => (
              <LogoCard key={`r2-${t.id}-${i}`} tenant={t} />
            ))}
          </div>
        </div>

        {/* Edge fade — только над маркизом */}
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />
      </div>
    </section>
  )
}
