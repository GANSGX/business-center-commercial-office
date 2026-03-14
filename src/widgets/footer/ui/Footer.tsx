import Link from 'next/link'
import { LogoLink } from '@/shared/ui'
import { IconPhone, IconEmail, IconMapPin } from '@/shared/ui/icons'
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
    title: 'Услуги',
    links: [
      { href: '/services/parking', label: 'Парковка' },
      { href: '/services/advertising', label: 'Реклама' },
      { href: '/services/cleaning', label: 'Клининг' },
      { href: '/services/security', label: 'Охрана' },
    ],
  },
  {
    title: 'О центре',
    links: [
      { href: '/gallery', label: 'Фотогалерея' },
      { href: '/about', label: 'О нас' },
      { href: '/contacts', label: 'Контакты' },
      { href: '/location', label: 'Расположение' },
    ],
  },
]

const PHONE_RECEPTION = '+7 (383) 223-43-50'
const PHONE_RENT = '+7 (383) 217-80-07'
const EMAIL = 'kommunist35@mail.ru'
const ADDRESS = '630007, г. Новосибирск, ул. Коммунистическая, 35'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* ── Верхний блок ── */}
        <div className={styles.top}>
          {/* Бренд + контакты */}
          <div className={styles.brand}>
            <LogoLink className={styles.logo} aria-label="На главную">
              <div className={styles.logoMark}>
                <span>БЦ</span>
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>Коммунистическая-35</span>
                <span className={styles.logoSub}>Бизнес-центр</span>
              </div>
            </LogoLink>

            <p className={styles.tagline}>
              Аренда офисов в центре Новосибирска —<br />5 минут пешком от метро «Площадь Ленина»
            </p>

            <div className={styles.contacts}>
              <a
                href={`tel:${PHONE_RECEPTION.replace(/\s|\(|\)|-/g, '')}`}
                className={styles.contactItem}
              >
                <IconPhone size={14} className={styles.contactIcon} />
                <span>
                  <span className={styles.contactSubLabel}>Приёмная&nbsp;</span>
                  {PHONE_RECEPTION}
                </span>
              </a>
              <a
                href={`tel:${PHONE_RENT.replace(/\s|\(|\)|-/g, '')}`}
                className={styles.contactItem}
              >
                <IconPhone size={14} className={styles.contactIcon} />
                <span>
                  <span className={styles.contactSubLabel}>Отдел аренды&nbsp;</span>
                  {PHONE_RENT}
                </span>
              </a>
              <a href={`mailto:${EMAIL}`} className={styles.contactItem}>
                <IconEmail size={14} className={styles.contactIcon} />
                {EMAIL}
              </a>
              <div className={styles.contactItem}>
                <IconMapPin size={14} className={styles.contactIcon} />
                <span>{ADDRESS}</span>
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

        {/* ── Регистрационные данные (требование РФ) ── */}
        <div className={styles.legal}>
          <p>
            АО «Коммунистическая-35» &nbsp;·&nbsp; ИНН 5406247047 &nbsp;·&nbsp; КПП 540601001
            &nbsp;·&nbsp; ОГРН 1035402474293
          </p>
          <p>Юридический адрес: 630007, г. Новосибирск, ул. Коммунистическая, д. 35</p>
        </div>

        {/* ── Разделитель ── */}
        <div className={styles.divider} />

        {/* ── Нижний блок ── */}
        <div className={styles.bottom}>
          {/* Левая группа: копирайт + политика */}
          <div className={styles.bottomLeft}>
            <p className={styles.copy}>
              © {new Date().getFullYear()} АО «Коммунистическая-35». Все права защищены.
            </p>
            <Link href="/privacy" className={styles.privacyLink}>
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
