import React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, rows = 3, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs sm:text-sm font-bold text-on-surface-variant mb-1.5 font-sans"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            'w-full rounded-xl px-4 py-2.5 font-sans text-sm sm:text-base text-on-surface bg-surface-container-lowest border transition-colors duration-200 outline-none resize-y',
            'placeholder:text-on-surface-variant/40',
            'focus:ring-2 focus:ring-primary/40 focus:border-primary',
            error
              ? 'border-error focus:ring-error/30 focus:border-error text-error'
              : 'border-outline-variant/50 hover:border-outline-variant',
            disabled && 'opacity-60 bg-surface-container cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-error font-medium font-sans">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-on-surface-variant/75 font-sans">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
