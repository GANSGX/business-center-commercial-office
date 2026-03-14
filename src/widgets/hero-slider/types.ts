export interface HeroAdvantage {
  icon: 'location' | 'transport' | 'culture'
  title: string
  text: string
}

export type HeroSlide =
  | {
      id: string
      type: 'welcome'
      label: string
      title: string
      subtitle: string
      primaryCta: { text: string; href: string }
      secondaryCta: { text: string; href: string }
      image: string
    }
  | {
      id: string
      type: 'benefits'
      label: string
      title: string
      advantages: HeroAdvantage[]
      image: string
    }
