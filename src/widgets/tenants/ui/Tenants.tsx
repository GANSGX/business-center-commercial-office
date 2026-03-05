import styles from './Tenants.module.css'

// TODO Sprint 1 S1-D2-03: заменить на данные из /api/tenants
const TENANTS = [
  { id: '1', name: 'СибТехноПарк', color: 'blue' },
  { id: '2', name: 'МегаФон', color: 'green' },
  { id: '3', name: 'Ростелеком', color: 'amber' },
  { id: '4', name: 'S7 Airlines', color: 'teal' },
  { id: '5', name: 'ЗапСибБанк', color: 'purple' },
  { id: '6', name: 'GS Group', color: 'red' },
  { id: '7', name: 'НГУ-Инкубатор', color: 'indigo' },
  { id: '8', name: 'СибУголь', color: 'orange' },
  { id: '9', name: 'Авангард', color: 'teal' },
  { id: '10', name: 'ТехноГрупп', color: 'blue' },
  { id: '11', name: 'СибБизнес', color: 'amber' },
  { id: '12', name: 'Новасиб', color: 'green' },
]

// Делим компании на 2 ряда
const ROW_1 = TENANTS.slice(0, 6)
const ROW_2 = TENANTS.slice(6)

function LogoCard({ tenant }: { tenant: (typeof TENANTS)[number] }) {
  return (
    <div className={`${styles.logo} ${styles[`color_${tenant.color}`]}`}>
      <span className={styles.logoMark}>{tenant.name[0]}</span>
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

      {/* Ряд 1 — скроллит влево */}
      <div className={styles.marqueeWrap} aria-hidden="true">
        <div className={`${styles.marqueeTrack} ${styles.trackLeft}`}>
          {/* Дублируем дважды для бесшовного цикла */}
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

      {/* Edge fade — маски по краям */}
      <div className={styles.fadeLeft} aria-hidden="true" />
      <div className={styles.fadeRight} aria-hidden="true" />
    </section>
  )
}
