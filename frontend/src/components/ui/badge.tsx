import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'aqua' | 'outline'
}

const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-gray-800 text-gray-300':                    variant === 'default',
          'bg-aqua-800 text-aqua-100':                    variant === 'aqua',
          'border border-gray-700 text-gray-400':          variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }