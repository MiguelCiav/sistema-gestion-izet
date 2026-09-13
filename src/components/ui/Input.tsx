import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const generatedId = React.useId()
    const inputId = id || generatedId
    const isPasswordType = type === 'password'
    const computedType = isPasswordType && isPasswordVisible ? 'text' : type

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-bold text-on-surface-variant mb-1.5 font-sans"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-on-surface-variant/70 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            type={computedType}
            disabled={disabled}
            className={cn(
              'w-full min-h-[46px] rounded-xl px-4 py-2.5 font-sans text-sm sm:text-base text-on-surface bg-surface-container-lowest border transition-colors duration-200 outline-none',
              'placeholder:text-on-surface-variant/40',
              'focus:ring-2 focus:ring-primary/40 focus:border-primary',
              error
                ? 'border-error focus:ring-error/30 focus:border-error text-error'
                : 'border-outline-variant/50 hover:border-outline-variant',
              leftIcon && 'pl-11',
              (rightIcon || (isPasswordType && showPasswordToggle)) && 'pr-11',
              disabled && 'opacity-60 bg-surface-container cursor-not-allowed',
              className
            )}
            {...props}
          />
          {isPasswordType && showPasswordToggle ? (
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-3.5 text-on-surface-variant/70 hover:text-on-surface transition-colors p-1 focus:outline-none"
              tabIndex={-1}
              aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : (
            rightIcon && (
              <span className="absolute right-3.5 text-on-surface-variant/70 pointer-events-none flex items-center justify-center">
                {rightIcon}
              </span>
            )
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-error font-medium font-sans flex items-center gap-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-on-surface-variant/75 font-sans">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
