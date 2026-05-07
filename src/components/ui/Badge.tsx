import { cn } from '../../lib/utils/cn'

interface BadgeProps {
  label: string
  variant?: 'default' | 'gold' | 'outline'
  className?: string
}

export default function Badge({
  label,
  variant = 'default',
  className,
}: BadgeProps) {
  const base = `
    inline-flex items-center justify-center
    text-small font-secondary tracking-wider uppercase
    px-md py-xs rounded-sm
  `

  const variants = {
    default: 'bg-secondary-grey/20 text-secondary-grey',
    gold: 'bg-accent-gold text-primary-white',
    outline: 'border border-secondary-grey text-secondary-grey bg-transparent',
  }

  return (
    <span className={cn(base, variants[variant], className)}>
      {label}
    </span>
  )
}
