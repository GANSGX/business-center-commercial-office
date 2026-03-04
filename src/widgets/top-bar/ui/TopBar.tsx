import Link from 'next/link'
import {
  IconPhone,
  IconEmail,
  IconMapPin,
  IconVk,
  IconWhatsapp,
  IconTelegram,
  IconAvito,
} from '@/shared/ui/icons'
import type { TopBarProps } from '../types'
import styles from './TopBar.module.css'

export function TopBar({ phones, email, address, socials }: TopBarProps) {
  return (
    <div className={styles.topBar}>
      <div className={`container ${styles.inner}`}>
        {/* LEFT — контакты как macOS menu items */}
        <div className={styles.contacts}>
          {phones[0] && (
            <a href={`tel:${phones[0].replace(/\D/g, '')}`} className={styles.contactItem}>
              <IconPhone size={11} />
              <span>{phones[0]}</span>
            </a>
          )}
          {phones[1] && (
            <a
              href={`tel:${phones[1].replace(/\D/g, '')}`}
              className={`${styles.contactItem} ${styles.phoneSecondary}`}
            >
              <IconPhone size={11} />
              <span>{phones[1]}</span>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className={`${styles.contactItem} ${styles.emailItem}`}>
              <IconEmail size={11} />
              <span>{email}</span>
            </a>
          )}
          {address && (
            <span className={`${styles.contactItem} ${styles.addressItem}`}>
              <IconMapPin size={11} />
              <span>{address}</span>
            </span>
          )}
        </div>

        {/* RIGHT — macOS dots: кружки бренд-цветов, иконка соцсети белая внутри */}
        <div className={styles.socials}>
          {socials?.vk && (
            <Link
              href={socials.vk}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.socialLinkVk}`}
              aria-label="ВКонтакте"
            >
              <IconVk size={24} />
            </Link>
          )}
          {socials?.wa && (
            <Link
              href={socials.wa}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.socialLinkWa}`}
              aria-label="WhatsApp"
            >
              <IconWhatsapp size={24} />
            </Link>
          )}
          {socials?.tg && (
            <Link
              href={socials.tg}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.socialLinkTg}`}
              aria-label="Telegram"
            >
              <IconTelegram size={24} />
            </Link>
          )}
          {socials?.avito && (
            <Link
              href={socials.avito}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.socialLinkAvito}`}
              aria-label="Avito"
            >
              <IconAvito size={24} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
