import styles from './Badge.module.css'

type Status = 'free' | 'reserved' | 'rented'

const labels: Record<Status, string> = {
  free: 'Свободно',
  reserved: 'Забронировано',
  rented: 'Арендовано',
}

interface BadgeProps {
  status: Status
}

export function Badge({ status }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[status]}`}>{labels[status]}</span>
}
