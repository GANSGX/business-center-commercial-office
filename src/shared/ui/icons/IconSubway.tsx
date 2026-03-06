interface IconProps {
  size?: number
  className?: string
}

export function IconSubway({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="14" rx="4" />
      <path d="M4 10h16M8 18l-2 4M16 18l2 4" />
      <circle cx="8.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
