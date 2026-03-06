import styles from './Advantages.module.css'

// Bento-layout (4 cols):
// Row 1: [Access 24/7 — wide×2] [Metro — wide×2]
// Row 2: [Location] [Flexible — wide×2] [Security]
// Row 3: [Parking] [Infra] [Internet — wide×2]

const ADVANTAGES = [
  // ── Row 1 ──────────────────────────────
  {
    id: 'access',
    wide: true,
    accentClass: 'accentBlue',
    stat: '24/7',
    tag: 'Круглосуточно',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Круглосуточный доступ',
    text: 'Работайте в удобное время без ограничений',
  },
  {
    id: 'metro',
    wide: true,
    accentClass: 'accentPurple',
    stat: '5–10 мин',
    tag: 'До метро',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="2" width="16" height="14" rx="4" />
        <path d="M4 10h16M8 18l-2 4M16 18l2 4" />
        <circle cx="8.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Метро рядом',
    text: 'Пешком до станции «Площадь Ленина»',
  },
  // ── Row 2 ──────────────────────────────
  {
    id: 'location',
    wide: false,
    accentClass: 'accentAmber',
    stat: null,
    tag: 'Центр города',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6Z" />
        <circle cx="12" cy="8" r="2" />
      </svg>
    ),
    title: 'Удобное расположение',
    text: 'Центр Новосибирска, ул. Коммунистическая, 35',
  },
  {
    id: 'flexible',
    wide: true,
    accentClass: 'accentTeal',
    stat: 'от 15 м²',
    tag: 'Аренда',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <path d="M12 12v4M10 14h4" />
      </svg>
    ),
    title: 'Гибкие условия',
    text: 'Офисы на любой формат бизнеса, аренда от 1 месяца',
  },
  {
    id: 'security',
    wide: false,
    accentClass: 'accentRed',
    stat: null,
    tag: 'Охрана 24/7',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3L4 7v5c0 5.25 4.5 9 8 9s8-3.75 8-9V7l-8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Охрана',
    text: 'Видеонаблюдение и охранники круглосуточно',
  },
  // ── Row 3 ──────────────────────────────
  {
    id: 'parking',
    wide: false,
    accentClass: 'accentGreen',
    stat: null,
    tag: 'Бесплатно',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </svg>
    ),
    title: 'Парковка',
    text: 'Бесплатная охраняемая парковка',
  },
  {
    id: 'infra',
    wide: false,
    accentClass: 'accentOrange',
    stat: null,
    tag: 'Рядом',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
    title: 'Инфраструктура',
    text: 'Кафе, банки, магазины в шаговой доступности',
  },
  {
    id: 'internet',
    wide: true,
    accentClass: 'accentIndigo',
    stat: null,
    tag: 'Оптоволокно',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Высокоскоростной интернет',
    text: 'Оптоволоконный интернет в каждый офис',
  },
]

export function Advantages() {
  return (
    <section className={styles.section} aria-labelledby="advantages-title">
      <div className={styles.inner}>
        {/* Шапка */}
        <div className={styles.head}>
          <span className={styles.label}>Почему мы</span>
          <h2 className={styles.title} id="advantages-title">
            Преимущества бизнес-центра
          </h2>
          <p className={styles.subtitle}>Всё, что нужно для продуктивной работы — уже включено</p>
        </div>

        {/* Bento-grid */}
        <ul className={styles.grid} role="list">
          {ADVANTAGES.map((item) => (
            <li
              key={item.id}
              className={[
                styles.card,
                styles[item.accentClass],
                item.wide ? styles.cardWide : '',
                item.stat ? styles.cardStat : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Иконка + тег */}
              <div className={styles.cardTop}>
                <span className={styles.iconWrap}>{item.icon}</span>
                <span className={styles.tag}>{item.tag}</span>
              </div>

              {/* Большое stat-число */}
              {item.stat && (
                <p className={styles.statNumber} aria-hidden="true">
                  {item.stat}
                </p>
              )}

              {/* Текст */}
              <div className={styles.cardBottom}>
                <strong className={styles.cardTitle}>{item.title}</strong>
                <p className={styles.cardText}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
