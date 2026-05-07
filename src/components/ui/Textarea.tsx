import { cn } from '../../lib/utils/cn'
import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className="space-y-sm">
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

        <textarea
          ref={ref}
          id={inputId}
          aria-describedby={
            [error && errorId, hint && hintId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-invalid={!!error}
          rows={4}
          className={cn(
            `w-full bg-transparent border text-primary-white
             text-body px-md py-md resize-none
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

        {hint && !error && (
          <p id={hintId} className="text-small text-secondary-grey">
            {hint}
          </p>
        )}

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

Textarea.displayName = 'Textarea'

export default Textarea