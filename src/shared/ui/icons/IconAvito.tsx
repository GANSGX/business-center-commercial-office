interface IconProps {
  size?: number
  className?: string
}

export function IconAvito({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-4c-.83 0-1.5-.67-1.5-1.5S12.67 9.5 13.5 9.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-6 0C6.67 12.5 6 11.83 6 11s.67-1.5 1.5-1.5S9 10.17 9 11s-.67 1.5-1.5 1.5zm4.5-4c-.83 0-1.5-.67-1.5-1.5S11.17 5.5 12 5.5s1.5.67 1.5 1.5S12.83 8.5 12 8.5z" />
    </svg>
  )
}
