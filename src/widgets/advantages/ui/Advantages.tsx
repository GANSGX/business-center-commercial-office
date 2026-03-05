import styles from './Advantages.module.css'

const ADVANTAGES = [
  {
    id: 'location',
    number: '01',
    accentClass: 'accentAmber',
    icon: (
      <svg
        width="26"
        height="26"
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
    text: 'Центр Новосибирска — ул. Коммунистическая, 35',
  },
  {
    id: 'access',
    number: '02',
    accentClass: 'accentBlue',
    icon: (
      <svg
        width="26"
        height="26"
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
    title: 'Доступ 24/7',
    text: 'Круглосуточный вход без ограничений',
  },
  {
    id: 'security',
    number: '03',
    accentClass: 'accentRed',
    icon: (
      <svg
        width="26"
        height="26"
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
  {
    id: 'parking',
    number: '04',
    accentClass: 'accentGreen',
    icon: (
      <svg
        width="26"
        height="26"
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
    text: 'Бесплатная охраняемая парковка для арендаторов',
  },
  {
    id: 'metro',
    number: '05',
    accentClass: 'accentPurple',
    icon: (
      <svg
        width="26"
        height="26"
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
    text: '7 минут пешком до «Площадь Ленина»',
  },
  {
    id: 'infra',
    number: '06',
    accentClass: 'accentOrange',
    icon: (
      <svg
        width="26"
        height="26"
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
    title: 'Развитая инфраструктура',
    text: 'Кафе, банки, магазины в шаговой доступности',
  },
  {
    id: 'flexible',
    number: '07',
    accentClass: 'accentTeal',
    icon: (
      <svg
        width="26"
        height="26"
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
    text: 'Офисы от 15\u00a0м², аренда от 1 месяца',
  },
  {
    id: 'internet',
    number: '08',
    accentClass: 'accentIndigo',
    icon: (
      <svg
        width="26"
        height="26"
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

        {/* Сетка */}
        <ul className={styles.grid} role="list">
          {ADVANTAGES.map((item) => (
            <li key={item.id} className={`${styles.card} ${styles[item.accentClass]}`}>
              {/* Декоративный номер */}
              <span className={styles.cardNumber} aria-hidden="true">
                {item.number}
              </span>
              {/* Иконка */}
              <span className={styles.iconWrap}>{item.icon}</span>
              {/* Текст */}
              <strong className={styles.cardTitle}>{item.title}</strong>
              <p className={styles.cardText}>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
