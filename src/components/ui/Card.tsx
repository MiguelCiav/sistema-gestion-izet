import React from 'react'
import { cn } from '../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'warm' | 'accent-left' | 'alert-warning' | 'alert-danger'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default:
        'bg-surface-container-low border border-outline-variant/30 text-on-surface shadow-sm',
      elevated:
        'bg-surface-container-lowest border border-outline-variant/40 text-on-surface shadow-md',
      warm:
        'bg-surface-warm border border-outline-variant/30 text-on-surface shadow-sm',
      'accent-left':
        'bg-surface-container-lowest border border-outline-variant/30 border-l-4 border-l-primary text-on-surface shadow-sm',
      'alert-warning':
        'bg-[#fdf4dc] border border-[#dec38e] border-l-4 border-l-[#705c30] text-[#251a00] shadow-sm',
      'alert-danger':
        'bg-[#fdeeed] border border-[#ffdad6] border-l-4 border-l-error text-[#410002] shadow-sm',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200 overflow-hidden',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-5 flex flex-col space-y-1.5', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-display text-lg sm:text-xl font-bold tracking-tight text-on-surface', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs sm:text-sm text-on-surface-variant font-sans', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-5 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-5 pt-0 flex items-center', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'
