'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
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
    label: 'Бизнес-центр «Коммунистическая-35»',
    title: 'Пространство для вашего бизнеса',
    subtitle:
      'Современные офисы, переговорные комнаты и открытые пространства — всё для комфортной работы вашей команды.',
    primaryCta: { text: 'Свободные офисы', href: '/offices' },
    secondaryCta: { text: 'Подобрать офис', href: '/offices#filter' },
    image: '/images/hero-1.png',
  },
  {
    id: '2',
    type: 'benefits',
    label: 'Почему выбирают нас',
    title: '«Коммунистическая-35»',
    advantages: [
      {
        icon: 'location',
        title: 'Рядом с метро',
        text: '5–10 минут пешком до метро «Площадь Ленина»',
      },
      {
        icon: 'transport',
        title: 'Транспортная доступность',
        text: 'Городской транспорт курсирует по всем направлениям, есть парковка',
      },
      {
        icon: 'culture',
        title: 'Развитая инфраструктура',
        text: 'Банки, рестораны, кафе и торговые точки — всё в шаговой доступности',
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

function IconChevronDown() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function IconSubway() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="14" rx="4" />
      <path d="M4 10h16M8 18l-2 4M16 18l2 4" />
      <circle cx="8.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3L4 7v5c0 5.25 4.5 9 8 9s8-3.75 8-9V7l-8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function IconParking() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  )
}

function IconAward() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
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
  const heroRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progressWidth, setProgressWidth] = useState(0)

  const handleAutoplayTimeLeft = useCallback((_: SwiperType, __: number, progress: number) => {
    setProgressWidth((1 - progress) * 100)
  }, [])

  const goToSlide = useCallback((index: number) => {
    swiperRef.current?.slideToLoop(index)
  }, [])

  const scrollToOffers = useCallback(() => {
    const target = document.getElementById('offers')
    if (!target) return
    const start = window.scrollY
    const end = target.getBoundingClientRect().top + start
    const duration = 1100
    let startTime: number | null = null

    const easeInOutQuart = (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      window.scrollTo(0, start + (end - start) * easeInOutQuart(progress))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [])

  // Блюр героя + пауза автоплея при скролле вниз (OffersPreview перекрывает слайдер)
  useEffect(() => {
    let rafId: number | null = null
    const vh = window.innerHeight

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const scrollY = window.scrollY

        const swiper = swiperRef.current
        if (swiper) {
          if (scrollY > vh * 0.08) {
            swiper.autoplay?.stop()
          } else {
            swiper.autoplay?.start()
          }
        }

        const hero = heroRef.current
        if (hero) {
          const progress = Math.min(scrollY / (vh * 0.4), 1)
          hero.style.filter = progress > 0 ? `blur(${(progress * 24).toFixed(1)}px)` : ''
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} aria-label="Бизнес-центр «Коммунистическая-35»">
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
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'low'}
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className={styles.overlay} />
            </div>

            {/* Слайд 1 — атмосферная фраза + scroll (правая сторона, абсолютно) */}
            {slide.type === 'welcome' && (
              <div className={styles.scrollHint}>
                <p className={styles.scrollPhrase}>
                  <span>Место,</span>
                  <span>где рождаются</span>
                  <span>решения</span>
                </p>
                <button
                  type="button"
                  className={styles.scrollArrowWrap}
                  onClick={scrollToOffers}
                  aria-label="Перейти к актуальным предложениям"
                >
                  <span className={styles.scrollLabel}>Узнать больше</span>
                  <IconChevronDown />
                </button>
              </div>
            )}

            {/* Слайд 2 — плавающие пилюли хаотично (левая сторона, абсолютно) */}
            {slide.type === 'benefits' && (
              <div className={styles.floatingPills}>
                <div
                  className={`${styles.floatingPill} ${styles.floatingPill1} ${styles.pillAmber}`}
                >
                  <span className={styles.pillIcon}>
                    <IconLocation />
                  </span>
                  <span>ул. Коммунистическая, 35</span>
                </div>
                <div
                  className={`${styles.floatingPill} ${styles.floatingPill2} ${styles.pillPurple}`}
                >
                  <span className={styles.pillIcon}>
                    <IconBuilding />
                  </span>
                  <span>от 8 до 150 м²</span>
                </div>
                <div className={`${styles.floatingPill} ${styles.floatingPill3} ${styles.pillRed}`}>
                  <span className={styles.pillIcon}>
                    <IconShield />
                  </span>
                  <span>Охрана 24/7</span>
                </div>
                <div
                  className={`${styles.floatingPill} ${styles.floatingPill4} ${styles.pillBlue}`}
                >
                  <span className={styles.pillIcon}>
                    <IconSubway />
                  </span>
                  <span>5–10 мин до метро «Площадь Ленина»</span>
                </div>
                <div
                  className={`${styles.floatingPill} ${styles.floatingPill5} ${styles.pillGreen}`}
                >
                  <span className={styles.pillIcon}>
                    <IconParking />
                  </span>
                  <span>Бесплатная парковка</span>
                </div>
                <div
                  className={`${styles.floatingPill} ${styles.floatingPill6} ${styles.pillOrange}`}
                >
                  <span className={styles.pillIcon}>
                    <IconAward />
                  </span>
                  <span>Класс Б+</span>
                </div>
              </div>
            )}

            {/* Карточка */}
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
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={scrollToOffers}
                        aria-label="Перейти к актуальным предложениям"
                      >
                        {slide.primaryCta.text}
                      </button>
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
