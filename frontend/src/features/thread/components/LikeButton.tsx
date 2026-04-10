import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  threadId: number
  initialLiked: boolean
  likeCount: number
  onToggle: (threadId: number) => void
}

export default function LikeButton({
  threadId,
  initialLiked,
  likeCount,
  onToggle
}: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAnimating(true)
    onToggle(threadId)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-1.5 text-xs transition-all duration-200 group',
        initialLiked
          ? 'text-aqua-400'           // ✅ conditional: sudah di-like
          : 'text-gray-600 hover:text-aqua-400' // ✅ conditional: belum di-like
      )}
    >
      {/* Conditional rendering icon — filled vs outline */}
      {initialLiked ? (
        // ✅ Sudah di-like: icon filled + scale animasi
        <Heart
          size={16}
          fill="currentColor"
          className={cn('transition-transform', isAnimating && 'scale-125')}
        />
      ) : (
        // ✅ Belum di-like: icon outline
        <Heart
          size={16}
          fill="none"
          className={cn('transition-transform group-hover:scale-110', isAnimating && 'scale-125')}
        />
      )}

      <span className={cn(
        'tabular-nums transition-colors',
        initialLiked ? 'text-aqua-400' : 'text-gray-600'
      )}>
        {likeCount}
      </span>
    </button>
  )
}