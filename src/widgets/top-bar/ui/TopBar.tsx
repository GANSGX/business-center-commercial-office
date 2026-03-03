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
  const hasSocials = socials && Object.values(socials).some(Boolean)

  return (
    <div className={styles.topBar}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.contacts}>
          {phones.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/\D/g, '')}`} className={styles.contactItem}>
              <IconPhone size={13} />
              <span className={styles.contactText}>{phone}</span>
            </a>
          ))}

          {email && (
            <a href={`mailto:${email}`} className={`${styles.contactItem} ${styles.emailItem}`}>
              <IconEmail size={13} />
              <span className={styles.contactText}>{email}</span>
            </a>
          )}

          {address && (
            <span className={`${styles.contactItem} ${styles.addressItem}`}>
              <IconMapPin size={13} />
              <span className={styles.contactText}>{address}</span>
            </span>
          )}
        </div>

        {hasSocials && (
          <div className={styles.socials}>
            {socials?.vk && (
              <Link
                href={socials.vk}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="ВКонтакте"
              >
                <IconVk size={16} />
              </Link>
            )}
            {socials?.wa && (
              <Link
                href={socials.wa}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="WhatsApp"
              >
                <IconWhatsapp size={16} />
              </Link>
            )}
            {socials?.tg && (
              <Link
                href={socials.tg}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Telegram"
              >
                <IconTelegram size={16} />
              </Link>
            )}
            {socials?.avito && (
              <Link
                href={socials.avito}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Avito"
              >
                <IconAvito size={16} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
