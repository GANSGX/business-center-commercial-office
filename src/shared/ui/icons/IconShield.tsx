interface IconProps {
  size?: number
  className?: string
}

export function IconShield({ size = 16, className }: IconProps) {
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
      <path d="M12 3L4 7v5c0 5.25 4.5 9 8 9s8-3.75 8-9V7l-8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}
