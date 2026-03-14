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

      {/* ── Анимация ── */}
      <div className={styles.scene} aria-hidden="true">
        {/* Молоток */}
        <div className={styles.hammerWrap}>
          <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
            {/* Рукоятка */}
            <rect x="34" y="28" width="10" height="78" rx="5" fill="url(#handleGrad)" />
            {/* Головка молотка */}
            <rect x="10" y="10" width="56" height="26" rx="6" fill="url(#headGrad)" />
            {/* Блик на головке */}
            <rect x="12" y="12" width="52" height="7" rx="3" fill="rgba(255,255,255,0.12)" />
            <defs>
              <linearGradient
                id="handleGrad"
                x1="34"
                y1="28"
                x2="44"
                y2="106"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#c8a068" />
                <stop offset="100%" stopColor="#7a5030" />
              </linearGradient>
              <linearGradient
                id="headGrad"
                x1="10"
                y1="10"
                x2="66"
                y2="36"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#9aa0aa" />
                <stop offset="40%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Вспышка удара */}
        <div className={styles.impactDot} />

        {/* Пыль */}
        <div className={styles.dust}>
          <div className={styles.dustParticle} />
          <div className={styles.dustParticle} />
          <div className={styles.dustParticle} />
        </div>

        {/* Кирпичи */}
        <div className={styles.bricks}>
          {/* Верхний строящийся ряд */}
          <div className={`${styles.brickRow} ${styles.brickRowTop}`}>
            <div className={styles.brick} />
            <div className={styles.brick} />
          </div>
          <div className={styles.mortar} />
          {/* Ряд 3 */}
          <div className={styles.brickRow}>
            <div className={styles.brick} />
            <div className={styles.brick} />
            <div className={styles.brick} />
          </div>
          <div className={styles.mortar} />
          {/* Ряд 2 со смещением */}
          <div className={styles.brickRow}>
            <div className={styles.brick} />
            <div className={styles.brick} />
            <div className={styles.brick} />
          </div>
          <div className={styles.mortar} />
          {/* Ряд 1 (нижний) */}
          <div className={styles.brickRow}>
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
          {subtitle.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < subtitle.split('\n').length - 1 && <br />}
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
