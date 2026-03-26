'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import Image from 'next/image'
import Link from 'next/link'
import {
  IconChevronDown,
  IconLocation,
  IconTransport,
  IconCulture,
  IconSubway,
  IconBuilding,
  IconShield,
  IconParking,
  IconAward,
} from '@/shared/ui/icons'
import type { HeroSlide } from '../types'
import styles from './HeroSlider.module.css'

import 'swiper/css'
import 'swiper/css/effect-fade'

// TODO Sprint 1 S1-D2-03: заменить на данные из /api/hero-slides
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
    image: '/images/fix_bgc_slider.jpg',
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
        text: 'Городской транспорт курсирует по всем направлениям, есть парковка во дворе',
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
    // Вызываем сразу — чтобы блюр применился при перезагрузке в середине страницы
    handleScroll()
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
                className={slide.type === 'welcome' ? styles.bgImg : undefined}
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
                  <IconChevronDown size={24} />
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
                  <span>от 20 до 263 м²</span>
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
