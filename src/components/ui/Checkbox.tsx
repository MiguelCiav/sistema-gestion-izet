import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  error?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, checked, disabled, id, onChange, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId

    return (
      <div className="flex flex-col text-left">
        <label
          htmlFor={checkboxId}
          className={cn(
            'inline-flex items-start gap-3 cursor-pointer select-none',
            disabled && 'opacity-60 cursor-not-allowed'
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              id={checkboxId}
              ref={ref}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center',
                'border-outline-variant/80 bg-surface-container-lowest peer-checked:bg-primary peer-checked:border-primary',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-1',
                disabled && 'opacity-60',
                className
              )}
            >
              {checked && <Check className="h-3.5 w-3.5 text-on-primary stroke-[3]" />}
            </div>
          </div>
          {label && (
            <span className="text-sm font-sans text-on-surface font-normal leading-snug">
              {label}
            </span>
          )}
        </label>
        {error && <p className="mt-1 text-xs text-error font-medium font-sans">{error}</p>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
