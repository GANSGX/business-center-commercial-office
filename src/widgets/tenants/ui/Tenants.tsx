import Image from 'next/image'
import Link from 'next/link'
import { IconChevronDown } from '@/shared/ui/icons'
import styles from './Tenants.module.css'

const TENANTS = [
  {
    id: '1',
    name: 'ТКБ Банк',
    color: 'blue',
    logo: '/images/logo_part/ТКБ Банк.png',
  },
  {
    id: '2',
    name: 'СберПраво',
    color: 'green',
    logo: '/images/logo_part/сбер право.png',
  },
  {
    id: '3',
    name: 'I Dolci',
    color: 'amber',
    logo: '/images/logo_part/I Dolci.png',
  },
  {
    id: '4',
    name: 'Русский Фейерверк',
    color: 'red',
    logo: '/images/logo_part/Русский Фейерверк.webp',
  },
  {
    id: '5',
    name: 'Angiopharm',
    color: 'purple',
    logo: '/images/logo_part/Angiopharm.png',
  },
  {
    id: '6',
    name: 'НРК-Р.О.С.Т.',
    color: 'indigo',
    logo: '/images/logo_part/НРК-Р.О.С.Т..png',
  },
  {
    id: '7',
    name: 'ИНПЭС',
    color: 'teal',
    logo: '/images/logo_part/ИНПЭС.png',
  },
  {
    id: '8',
    name: 'Имплант Сибири',
    color: 'orange',
    logo: '/images/logo_part/Имплант Сибири.png',
  },
]

const TENANTS_REV = [...TENANTS].reverse()

// 3 копии — бесшовный цикл на любом экране (до 4K), анимация -33.33%
const ROW_1 = [...TENANTS, ...TENANTS, ...TENANTS]
const ROW_2 = [...TENANTS_REV, ...TENANTS_REV, ...TENANTS_REV]

function LogoCard({ tenant }: { tenant: (typeof TENANTS)[number] }) {
  return (
    <Link
      href="/in-building"
      className={`${styles.logo} ${styles[`color_${tenant.color}`]}`}
      tabIndex={-1}
      aria-hidden="true"
    >
      <span className={styles.logoMark}>
        <Image
          src={tenant.logo}
          alt={tenant.name}
          width={38}
          height={38}
          className={styles.faviconImg}
          loading="lazy"
        />
      </span>
      <span className={styles.logoName}>{tenant.name}</span>
    </Link>
  )
}

export function Tenants() {
  return (
    <section className={styles.section} aria-labelledby="tenants-title">
      <div className={styles.head}>
        <span className={styles.label}>Нам доверяют</span>
        <h2 className={styles.title} id="tenants-title">
          <Link href="/in-building" className={styles.titleLink}>
            Наши арендаторы
            <span className={styles.titleArrow} aria-hidden="true">
              <IconChevronDown size={32} />
            </span>
          </Link>
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
