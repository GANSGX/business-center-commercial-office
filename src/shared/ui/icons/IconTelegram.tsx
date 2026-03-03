interface IconProps {
  size?: number
  className?: string
}

export function IconTelegram({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 6.886-1.687 7.953c-.127.567-.461.707-.934.44l-2.583-1.903-1.247 1.2c-.138.138-.254.254-.52.254l.186-2.634 4.8-4.336c.208-.186-.046-.287-.322-.1L7.6 14.48l-2.547-.796c-.553-.174-.566-.553.116-.82l9.677-3.73c.46-.167.866.113.084.752z" />
    </svg>
  )
}
