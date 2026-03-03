import { InputHTMLAttributes, forwardRef } from 'react'
import styles from './Checkbox.module.css'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, ...props }, ref) => {
    return (
      <div>
        <label className={styles.wrapper} htmlFor={id}>
          <input ref={ref} type="checkbox" id={id} className={styles.input} {...props} />
          {label && <span className={styles.label}>{label}</span>}
        </label>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
