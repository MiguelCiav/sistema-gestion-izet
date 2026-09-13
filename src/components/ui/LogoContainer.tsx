import React from 'react'
import { FlaskConical } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface LogoContainerProps {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  customText?: string
  className?: string
}

export const LogoContainer: React.FC<LogoContainerProps> = ({
  size = 'md',
  showIcon = false,
  customText = 'Logo',
  className,
}) => {
  const sizeStyles = {
    sm: 'w-24 h-24 text-xl',
    md: 'w-32 h-32 text-2xl',
    lg: 'w-40 h-40 text-3xl',
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center select-none', className)}>
      {/* Background layer 1 - subtle negative tilt */}
      <div
        className={cn(
          'absolute rounded-[2rem] bg-primary/10 border border-primary/20 transform -rotate-3 transition-transform',
          sizeStyles[size]
        )}
      />
      {/* Background layer 2 - subtle positive tilt */}
      <div
        className={cn(
          'absolute rounded-[2rem] bg-surface-container-high border border-outline-variant/40 transform rotate-2 shadow-sm transition-transform',
          sizeStyles[size]
        )}
      />
      {/* Foreground primary tile */}
      <div
        className={cn(
          'relative rounded-[2rem] bg-surface-warm border-2 border-outline-variant/60 shadow-md flex flex-col items-center justify-center text-primary font-display font-bold tracking-tight',
          sizeStyles[size]
        )}
      >
        {showIcon && <FlaskConical className="h-8 w-8 mb-1 text-primary stroke-[2.2]" />}
        <span>{customText}</span>
      </div>
    </div>
  )
}
