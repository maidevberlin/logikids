interface StarRatingProps {
  stars: number // 0-5
  size?: 'sm' | 'md' | 'lg'
}

export function StarRating({ stars, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl',
  }

  const clampedStars = Math.max(0, Math.min(5, Math.round(stars)))

  return (
    <div
      className={`flex gap-0.5 ${sizeClasses[size]}`}
      aria-label={`Mastery: ${clampedStars} out of 5 stars`}
      role="img"
    >
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={i < clampedStars ? 'text-yellow-500' : 'text-gray-300'}
          aria-hidden="true"
        >
          {i < clampedStars ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
