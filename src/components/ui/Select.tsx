import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const selectId = id || generatedId

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs sm:text-sm font-bold text-on-surface-variant mb-1.5 font-sans"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full min-h-[46px] appearance-none rounded-xl pl-4 pr-10 py-2.5 font-sans text-sm sm:text-base text-on-surface bg-surface-container-lowest border transition-colors duration-200 outline-none cursor-pointer',
              'focus:ring-2 focus:ring-primary/40 focus:border-primary',
              error
                ? 'border-error focus:ring-error/30 focus:border-error text-error'
                : 'border-outline-variant/50 hover:border-outline-variant',
              disabled && 'opacity-60 bg-surface-container cursor-not-allowed',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3.5 text-on-surface-variant/70 pointer-events-none flex items-center justify-center">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-error font-medium font-sans">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-on-surface-variant/75 font-sans">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Select.displayName = 'Select'
