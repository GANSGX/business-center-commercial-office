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
  subtitle = 'Мы работаем над этим разделом.\nСкоро здесь появится полезная информация.',
  backHref = '/',
  backLabel = 'На главную',
}: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.orbBlue} aria-hidden="true" />
      <div className={styles.orbAmber} aria-hidden="true" />

      <div className={styles.icon} aria-hidden="true">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>

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
