import { cn } from '@/lib/utils/cn'

type CheckoutStep = 'shipping' | 'payment' | 'confirm'

interface CheckoutProgressProps {
  currentStep: CheckoutStep
}

const steps = [
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirm', label: 'Confirm' },
] as const

export default function CheckoutProgress({
  currentStep,
}: CheckoutProgressProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep)

  return (
    <nav aria-label="Checkout progress">
      <ol
        className="flex items-center justify-center gap-md"
        role="list"
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = step.key === currentStep

          return (
            <li
              key={step.key}
              className="flex items-center gap-md"
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-sm">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    'text-small font-secondary transition-all duration-150',
                    isCompleted
                      ? 'bg-accent-gold text-primary-white'
                      : isCurrent
                      ? 'border-2 border-accent-gold text-accent-gold'
                      : 'border border-secondary-grey/40 text-secondary-grey'
                  )}
                  aria-hidden="true"
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span
                  className={cn(
                    'text-small hidden sm:block',
                    isCurrent
                      ? 'text-primary-white'
                      : isCompleted
                      ? 'text-accent-gold'
                      : 'text-secondary-grey'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 h-px transition-colors duration-150',
                    index < currentIndex
                      ? 'bg-accent-gold'
                      : 'bg-secondary-grey/20'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
