'use client'

import { useRef, useState, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import Image from 'next/image'
import Link from 'next/link'
import type { HeroSlide } from '../types'
import styles from './HeroSlider.module.css'

import 'swiper/css'
import 'swiper/css/effect-fade'

// TODO Sprint 1 S1-D2-03: заменить на данные из /api/hero-slides
// Фото: разместить в public/images/hero-1.jpg и hero-2.jpg (1920×1080, WebP)
const MOCK_SLIDES: HeroSlide[] = [
  {
    id: '1',
    type: 'welcome',
    label: 'Деловой центр «На Октябрьской»',
    title: 'Пространство для вашего бизнеса',
    subtitle:
      'Современные офисы в центре Новосибирска — гибкие условия аренды, развитая инфраструктура и выгодное расположение.',
    primaryCta: { text: 'Свободные офисы', href: '/offices' },
    secondaryCta: { text: 'Подобрать офис', href: '/offices#filter' },
    image: '/images/hero-1.png',
  },
  {
    id: '2',
    type: 'benefits',
    label: 'Почему выбирают нас',
    title: '«На Октябрьской»',
    advantages: [
      {
        icon: 'location',
        title: 'Удобное расположение',
        text: '7 минут ходьбы до метро «Площадь Ленина»',
      },
      {
        icon: 'transport',
        title: 'Развитая транспортная сеть',
        text: 'Отличная транспортная развязка, удобная парковка',
      },
      {
        icon: 'culture',
        title: 'Культурный квартал',
        text: 'Рядом с КДЦ имени Маяковского',
      },
    ],
    image: '/images/hero-2.png',
  },
]

function IconLocation() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6Z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  )
}

function IconTransport() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="8" width="18" height="10" rx="3" />
      <path d="M7 18v2M17 18v2M3 12h18" />
      <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
    </svg>
  )
}

function IconCulture() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
    </svg>
  )
}

const ADVANTAGE_ICONS = {
  location: IconLocation,
  transport: IconTransport,
  culture: IconCulture,
}

export function HeroSlider() {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progressWidth, setProgressWidth] = useState(0)

  const handleAutoplayTimeLeft = useCallback((_: SwiperType, __: number, progress: number) => {
    setProgressWidth((1 - progress) * 100)
  }, [])

  const goToSlide = useCallback((index: number) => {
    swiperRef.current?.slideToLoop(index)
  }, [])

  return (
    <section className={styles.hero} aria-label="Деловой центр «На Октябрьской»">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: false }}
        speed={1200}
        loop
        onSwiper={(s) => {
          swiperRef.current = s
        }}
        onSlideChange={(s) => {
          setActiveIndex(s.realIndex)
          setProgressWidth(0)
        }}
        onAutoplayTimeLeft={handleAutoplayTimeLeft}
        className={styles.swiper}
      >
        {MOCK_SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.id} className={styles.slide}>
            {/* Фон */}
            <div className={styles.bg}>
              <Image
                src={slide.image}
                alt=""
                fill
                priority
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className={styles.overlay} />
            </div>

            {/* Контент */}
            <div
              className={`${styles.contentWrap} ${
                slide.type === 'welcome' ? styles.contentWrapLeft : styles.contentWrapRight
              }`}
            >
              <div className={styles.content}>
                <span className={styles.label}>{slide.label}</span>

                {slide.type === 'welcome' ? (
                  <>
                    <h1 className={styles.title}>{slide.title}</h1>
                    <p className={styles.subtitle}>{slide.subtitle}</p>
                    <div className={styles.actions}>
                      <Link href={slide.primaryCta.href} className={styles.btnPrimary}>
                        {slide.primaryCta.text}
                      </Link>
                      <Link href={slide.secondaryCta.href} className={styles.btnGlass}>
                        {slide.secondaryCta.text}
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className={styles.title}>{slide.title}</h2>
                    <ul className={styles.advantagesList}>
                      {slide.advantages.map((adv) => {
                        const Icon = ADVANTAGE_ICONS[adv.icon]
                        return (
                          <li key={adv.icon} className={styles.advantageItem}>
                            <span
                              className={`${styles.advantageIcon} ${styles[`advantageIcon_${adv.icon}`]}`}
                            >
                              <Icon />
                            </span>
                            <div>
                              <strong className={styles.advantageTitle}>{adv.title}</strong>
                              <span className={styles.advantageText}>{adv.text}</span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Кастомная навигация — пилюли с прогрессом */}
      <nav className={styles.nav} aria-label="Навигация по слайдам">
        {MOCK_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            className={`${styles.navPill} ${activeIndex === index ? styles.navPillActive : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Слайд ${index + 1}`}
            aria-current={activeIndex === index ? 'true' : undefined}
          >
            {activeIndex === index && (
              <span className={styles.navPillFill} style={{ width: `${progressWidth}%` }} />
            )}
          </button>
        ))}
      </nav>
    </section>
  )
}
