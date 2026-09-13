import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isFullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      isFullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none select-none'

    const variantStyles = {
      primary:
        'bg-primary text-on-primary hover:bg-[#285237] active:bg-[#1e3f2a] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
      secondary:
        'bg-secondary-container text-on-secondary-container hover:bg-[#dfd3c3] active:bg-[#d5c7b5]',
      outline:
        'border-2 border-outline-variant/60 text-on-surface hover:bg-surface-container active:bg-surface-container-high',
      ghost:
        'text-on-surface-variant hover:bg-surface-container active:bg-surface-container-high',
      danger:
        'bg-error text-on-error hover:bg-[#a01616] active:bg-[#851212] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-5 py-2.5 text-sm rounded-xl gap-2 min-h-[44px]',
      lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5 min-h-[52px]',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          isFullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" data-testid="button-spinner" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
