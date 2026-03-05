import styles from './Tenants.module.css'

// TODO Sprint 1 S1-D2-03: заменить на данные из /api/tenants
const TENANTS = [
  { id: '1', name: 'СибТехноПарк', abbr: 'СТ', color: 'blue' },
  { id: '2', name: 'МегаФон', abbr: 'МФ', color: 'green' },
  { id: '3', name: 'Ростелеком', abbr: 'РТ', color: 'amber' },
  { id: '4', name: 'S7 Airlines', abbr: 'S7', color: 'teal' },
  { id: '5', name: 'ЗапСибБанк', abbr: 'ЗСБ', color: 'purple' },
  { id: '6', name: 'GS Group', abbr: 'GS', color: 'red' },
  { id: '7', name: 'НГУ-Инкубатор', abbr: 'НГУ', color: 'indigo' },
  { id: '8', name: 'СибУголь', abbr: 'СУ', color: 'orange' },
  { id: '9', name: 'Авангард', abbr: 'АВ', color: 'teal' },
  { id: '10', name: 'ТехноГрупп', abbr: 'ТГ', color: 'blue' },
  { id: '11', name: 'СибБизнес', abbr: 'СБ', color: 'amber' },
  { id: '12', name: 'Новасиб', abbr: 'НС', color: 'green' },
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
      <span className={styles.logoMark}>{tenant.abbr}</span>
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
