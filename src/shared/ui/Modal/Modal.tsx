'use client'

import { useEffect, useCallback, useRef, useId, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from '@/shared/ui/icons'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

const FOCUSABLE =
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

const SWIPE_THRESHOLD = 140 // px — сколько тянуть чтобы закрыть
const SWIPE_VELOCITY = 0.5 // px/ms — быстрый флик закрывает даже при малом смещении

export function Modal({ open, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // Drag state — refs чтобы не вызывать ре-рендер на каждый touchmove
  const dragStartY = useRef(0)
  const dragStartTime = useRef(0)
  const dragCurrent = useRef(0)
  const isDragging = useRef(false)

  // ── Swipe-to-close (только на мобильном bottom sheet ≤640px) ──

  const handleDragStart = useCallback((e: React.TouchEvent) => {
    if (window.innerWidth > 640) return
    isDragging.current = true
    dragStartY.current = e.touches[0].clientY
    dragStartTime.current = Date.now()
    dragCurrent.current = 0
    if (modalRef.current) modalRef.current.style.transition = 'none'
  }, [])

  const handleDragMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !modalRef.current) return
    const dy = e.touches[0].clientY - dragStartY.current
    if (dy <= 0) return // вверх не тянем
    dragCurrent.current = dy
    // opacity уменьшается по мере перетаскивания
    const progress = Math.min(dy / 300, 1)
    modalRef.current.style.transform = `translateY(${dy}px)`
    modalRef.current.style.opacity = String(1 - progress * 0.4)
  }, [])

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current || !modalRef.current) return
    isDragging.current = false

    const dy = dragCurrent.current
    const dt = Date.now() - dragStartTime.current
    const velocity = dy / dt
    dragCurrent.current = 0

    const shouldClose = dy > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY

    if (shouldClose) {
      modalRef.current.style.transition = 'transform 0.22s ease-in, opacity 0.22s ease-in'
      modalRef.current.style.transform = 'translateY(110%)'
      modalRef.current.style.opacity = '0'
      setTimeout(onClose, 220)
    } else {
      // Отпружинить назад
      modalRef.current.style.transition =
        'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease'
      modalRef.current.style.transform = ''
      modalRef.current.style.opacity = ''
      const ref = modalRef.current
      setTimeout(() => {
        ref.style.transition = ''
      }, 350)
    }
  }, [onClose])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !modalRef.current) return
      const elements = Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!elements.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    const firstFocusable = modalRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    ;(firstFocusable ?? modalRef.current)?.focus()
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onClick={(e) => e.stopPropagation()}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        tabIndex={-1}
      >
        {/* Drag handle — только на мобильном, тянуть вниз чтобы закрыть */}
        <div className={styles.dragHandle} onTouchStart={handleDragStart} aria-hidden="true" />

        {title && (
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <button className={styles.close} onClick={onClose} aria-label="Закрыть модальное окно">
              <IconClose size={16} />
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  )
}
