import Image from 'next/image'
import styles from './Tenants.module.css'

// TODO Sprint 1 S1-D2-03: заменить на данные из /api/tenants
// Только реальные компании с офисами в Новосибирске.
// Логотипы — Google Favicon API (128px).
const TENANTS = [
  { id: '1', name: 'Яндекс', color: 'amber', domain: 'yandex.ru' },
  { id: '2', name: 'Сбербанк', color: 'green', domain: 'sberbank.ru' },
  { id: '3', name: 'Газпром нефть', color: 'blue', domain: 'gazprom-neft.ru' },
  { id: '4', name: 'S7 Airlines', color: 'teal', domain: 's7.ru' },
  { id: '5', name: '2ГИС', color: 'green', domain: '2gis.ru' },
  { id: '6', name: 'МегаФон', color: 'green', domain: 'megafon.ru' },
  { id: '7', name: 'МТС', color: 'red', domain: 'mts.ru' },
  { id: '8', name: 'Ростелеком', color: 'amber', domain: 'rostelecom.ru' },
  { id: '9', name: 'ВТБ', color: 'blue', domain: 'vtb.ru' },
  { id: '10', name: 'Альфа-Банк', color: 'red', domain: 'alfabank.ru' },
  { id: '11', name: 'Билайн', color: 'amber', domain: 'beeline.ru' },
  { id: '12', name: 'GS Group', color: 'indigo', domain: 'gs.ru' },
]

const TENANTS_REV = [...TENANTS].reverse()

// 3 копии — бесшовный цикл на любом экране (до 4K), анимация -33.33%
const ROW_1 = [...TENANTS, ...TENANTS, ...TENANTS]
const ROW_2 = [...TENANTS_REV, ...TENANTS_REV, ...TENANTS_REV]

const FAVICON_API = 'https://www.google.com/s2/favicons'

function LogoCard({ tenant }: { tenant: (typeof TENANTS)[number] }) {
  return (
    <div className={`${styles.logo} ${styles[`color_${tenant.color}`]}`} aria-hidden="true">
      <span className={styles.logoMark}>
        <Image
          src={`${FAVICON_API}?domain=${tenant.domain}&sz=128`}
          alt={tenant.name}
          width={26}
          height={26}
          className={styles.faviconImg}
          loading="lazy"
          unoptimized
        />
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
        <p className={styles.subtitle}>
          Ведущие компании Новосибирска выбирают «Коммунистическая-35»
        </p>
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
