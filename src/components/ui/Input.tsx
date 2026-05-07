import { cn } from '../../lib/utils/cn'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className="space-y-sm">
        {/* Label */}
        <label
          htmlFor={inputId}
          className="block text-label text-primary-white"
        >
          {label}
          {props.required && (
            <span className="text-accent-gold ml-xs" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={
            [error && errorId, hint && hintId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-invalid={!!error}
          className={cn(
            `w-full bg-transparent border text-primary-white
             text-body px-md py-md
             placeholder:text-secondary-grey/60
             transition-colors duration-150
             focus:outline-none focus:border-accent-gold
             disabled:opacity-40 disabled:cursor-not-allowed`,
            error
              ? 'border-red-500'
              : 'border-secondary-grey/40 hover:border-secondary-grey',
            className
          )}
          {...props}
        />

        {/* Hint */}
        {hint && !error && (
          <p id={hintId} className="text-small text-secondary-grey">
            {hint}
          </p>
        )}

        {/* Error */}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-small text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input