import {
  IconClock,
  IconSubway,
  IconLocation,
  IconBriefcase,
  IconShield,
  IconParking,
  IconHome,
  IconWifi,
} from '@/shared/ui/icons'
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
    stat: 'Удобное время работы',
    tag: 'Время работы',
    Icon: IconClock,
    title: '',
    text: 'Приходите и уходите когда удобно — без строгих ограничений и лишних согласований',
  },
  {
    id: 'metro',
    wide: true,
    accentClass: 'accentPurple',
    stat: '5–10 мин',
    tag: 'До метро',
    Icon: IconSubway,
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
    Icon: IconLocation,
    title: 'Удобное расположение',
    text: 'Центр Новосибирска, ул. Коммунистическая, 35',
  },
  {
    id: 'flexible',
    wide: true,
    accentClass: 'accentTeal',
    stat: 'от 10 м²',
    tag: 'Аренда',
    Icon: IconBriefcase,
    title: 'Гибкие условия',
    text: 'Офисы на любой формат бизнеса, аренда от 1 месяца',
  },
  {
    id: 'security',
    wide: false,
    accentClass: 'accentRed',
    stat: null,
    tag: 'Охрана 24/7',
    Icon: IconShield,
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
    Icon: IconParking,
    title: 'Парковка',
    text: 'Бесплатная охраняемая парковка',
  },
  {
    id: 'infra',
    wide: false,
    accentClass: 'accentOrange',
    stat: null,
    tag: 'Рядом',
    Icon: IconHome,
    title: 'Инфраструктура',
    text: 'Кафе, банки, магазины — всё необходимое в здании и рядом',
  },
  {
    id: 'internet',
    wide: true,
    accentClass: 'accentIndigo',
    stat: null,
    tag: 'Оптоволокно',
    Icon: IconWifi,
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
                <span className={styles.iconWrap}>
                  <item.Icon size={22} />
                </span>
                <span className={styles.tag}>{item.tag}</span>
              </div>

              {/* Большое stat-число */}
              {item.stat && (
                <p
                  className={[styles.statNumber, item.stat.length > 10 ? styles.statNumberLong : '']
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                >
                  {item.stat}
                </p>
              )}

              {/* Текст */}
              <div className={styles.cardBottom}>
                {item.title && <strong className={styles.cardTitle}>{item.title}</strong>}
                <p className={styles.cardText}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
