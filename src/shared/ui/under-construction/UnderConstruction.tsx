import Link from 'next/link'
import styles from './UnderConstruction.module.css'

interface Props {
  title?: string
  subtitle?: string
  backHref?: string
  backLabel?: string
}

export function UnderConstruction({
  title = 'Страница в разработке',
  subtitle = 'Мы активно работаем над этим разделом.\nСкоро здесь появится полезная информация.',
  backHref = '/',
  backLabel = 'На главную',
}: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.orbBlue} aria-hidden="true" />
      <div className={styles.orbAmber} aria-hidden="true" />

      {/* ── Сцена ── */}
      <div className={styles.scene} aria-hidden="true">
        {/* Молоток: рукоятка сверху, голова снизу, ось вращения — верх рукоятки */}
        <div className={styles.hammerWrap}>
          <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
            <defs>
              <linearGradient
                id="uc-handle"
                x1="40"
                y1="0"
                x2="40"
                y2="80"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#d4a96a" />
                <stop offset="100%" stopColor="#8b5e2e" />
              </linearGradient>
              <linearGradient
                id="uc-head"
                x1="8"
                y1="80"
                x2="72"
                y2="110"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#a0a8b4" />
                <stop offset="50%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
            </defs>

            {/* Рукоятка (сверху) */}
            <rect x="34" y="0" width="12" height="88" rx="6" fill="url(#uc-handle)" />
            {/* Обмотка на рукоятке */}
            <rect x="33" y="4" width="14" height="3" rx="1.5" fill="rgba(0,0,0,0.2)" />
            <rect x="33" y="10" width="14" height="3" rx="1.5" fill="rgba(0,0,0,0.2)" />
            <rect x="33" y="16" width="14" height="3" rx="1.5" fill="rgba(0,0,0,0.2)" />

            {/* Голова молотка (снизу, горизонтальная) */}
            <rect x="8" y="82" width="64" height="26" rx="6" fill="url(#uc-head)" />
            {/* Блик на голове */}
            <rect x="10" y="84" width="60" height="7" rx="3" fill="rgba(255,255,255,0.14)" />
            {/* Торец (ударная часть) — правый */}
            <rect x="64" y="82" width="8" height="26" rx="3" fill="rgba(80,90,100,0.6)" />
          </svg>
        </div>

        {/* Вспышка удара */}
        <div className={styles.impactDot} />

        {/* Пыль */}
        <div className={styles.dust}>
          <div className={styles.dustParticle} />
          <div className={styles.dustParticle} />
          <div className={styles.dustParticle} />
          <div className={styles.dustParticle} />
        </div>

        {/* Кирпичная стена — строится снизу вверх */}
        <div className={styles.wall}>
          {/* Ряд 3 (верхний, строящийся) */}
          <div className={`${styles.brickRow} ${styles.row3}`}>
            <div className={styles.brick} />
            <div className={styles.brick} />
          </div>
          <div className={`${styles.mortar} ${styles.mortar2}`} />

          {/* Ряд 2 */}
          <div className={`${styles.brickRow} ${styles.row2}`}>
            <div className={styles.brick} />
            <div className={styles.brick} />
            <div className={styles.brick} />
          </div>
          <div className={`${styles.mortar} ${styles.mortar1}`} />

          {/* Ряд 1 (нижний) */}
          <div className={`${styles.brickRow} ${styles.row1}`}>
            <div className={styles.brick} />
            <div className={styles.brick} />
            <div className={styles.brick} />
          </div>
        </div>
      </div>

      {/* ── Текст ── */}
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />В разработке
        </div>

        <h1 className={styles.title}>{title}</h1>

        <p className={styles.subtitle}>
          {subtitle.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>

        <Link href={backHref} className={styles.backLink}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
