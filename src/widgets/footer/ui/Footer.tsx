import Link from 'next/link'
import Image from 'next/image'
import { LogoLink } from '@/shared/ui'
import {
  IconPhone,
  IconEmail,
  IconMapPin,
  IconVk,
  IconTelegram,
  IconWhatsapp,
} from '@/shared/ui/icons'
import { getSiteSettings, toTelHref, toAbsoluteUrl } from '@/shared/lib/getSiteSettings'
import styles from './Footer.module.css'

const NAV_COLUMNS = [
  {
    title: 'Аренда',
    links: [
      { href: '/offices', label: 'Все помещения' },
      { href: '/offices?type=office', label: 'Офисы' },
      { href: '/offices?type=storage', label: 'Складские помещения' },
    ],
  },
  {
    title: 'О центре',
    links: [
      { href: '/in-building', label: 'В здании' },
      { href: '/gallery', label: 'Фотогалерея' },
      { href: '/about', label: 'О нас' },
      { href: '/contacts', label: 'Контакты' },
      { href: '/location', label: 'Расположение' },
    ],
  },
]

export async function Footer() {
  const s = await getSiteSettings()

  const phone1 = s['phone1']
  const phone2 = s['phone2']
  const email = s['email']
  const address = s['address']

  const vk = toAbsoluteUrl(s['socialVk'] || '')
  const tg = toAbsoluteUrl(s['socialTg'] || '')
  const wa = s['socialWa'] || ''
  const hasSocials = vk || tg || wa

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* ── Верхний блок ── */}
        <div className={styles.top}>
          {/* Бренд + контакты */}
          <div className={styles.brand}>
            <LogoLink className={styles.logo} aria-label="На главную">
              <Image
                src="/images/logo.svg"
                alt="БЦ Коммунистическая-35"
                width={954}
                height={781}
                className={styles.logoImg}
              />
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>Коммунистическая-35</span>
                <span className={styles.logoSub}>Бизнес-центр</span>
              </div>
            </LogoLink>

            <p className={styles.tagline}>
              Аренда офисов в центре Новосибирска —<br />5 минут пешком от метро «Площадь Ленина»
            </p>

            <div className={styles.contacts}>
              <a href={toTelHref(phone1)} className={styles.contactItem}>
                <IconPhone size={14} className={styles.contactIcon} />
                <span>
                  <span className={styles.contactSubLabel}>Приёмная&nbsp;</span>
                  {phone1}
                </span>
              </a>
              <a href={toTelHref(phone2)} className={styles.contactItem}>
                <IconPhone size={14} className={styles.contactIcon} />
                <span>
                  <span className={styles.contactSubLabel}>Отдел аренды&nbsp;</span>
                  {phone2}
                </span>
              </a>
              <a href={`mailto:${email}`} className={styles.contactItem}>
                <IconEmail size={14} className={styles.contactIcon} />
                {email}
              </a>
              <div className={styles.contactItem}>
                <IconMapPin size={14} className={styles.contactIcon} />
                <span>{address}</span>
              </div>
            </div>
          </div>

          {/* Навигационные колонки */}
          <nav className={styles.nav} aria-label="Навигация в футере">
            {NAV_COLUMNS.map((col) => (
              <div key={col.title} className={styles.navCol}>
                <p className={styles.navColTitle}>{col.title}</p>
                <ul className={styles.navList}>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.navLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* ── Разделитель ── */}
        <div className={styles.divider} />

        {/* ── Нижний блок ── */}
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <p className={styles.copy}>
              © {new Date().getFullYear()} АО «Коммунистическая-35». Все права защищены.
            </p>
            <Link href="/privacy" className={styles.privacyLink}>
              Политика конфиденциальности
            </Link>
          </div>

          {hasSocials && (
            <div className={styles.socialsGroup}>
              <span className={styles.socialsLabel}>Мы в сети</span>
              <div className={styles.socials}>
                {vk && (
                  <a
                    href={vk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.socialBtn} ${styles.socialVk}`}
                    aria-label="ВКонтакте"
                  >
                    <IconVk size={16} />
                  </a>
                )}
                {tg && (
                  <a
                    href={tg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.socialBtn} ${styles.socialTg}`}
                    aria-label="Telegram"
                  >
                    <IconTelegram size={16} />
                  </a>
                )}
                {wa && (
                  <a
                    href={toTelHref(wa)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.socialBtn} ${styles.socialWa}`}
                    aria-label="WhatsApp"
                  >
                    <IconWhatsapp size={16} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
