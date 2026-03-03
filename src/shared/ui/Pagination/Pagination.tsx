import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className={styles.pagination} aria-label="Пагинация">
      <button
        className={styles.btn}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Предыдущая страница"
      >
        ←
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.btn} ${p === page ? styles.active : ''}`}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button
        className={styles.btn}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Следующая страница"
      >
        →
      </button>
    </nav>
  )
}
