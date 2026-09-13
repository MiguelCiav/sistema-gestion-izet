import React from 'react'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  icon?: React.ReactNode
  positionClassName?: string
  ariaLabel?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  label,
  icon = <Plus className="h-6 w-6 stroke-[2.5]" />,
  positionClassName = 'fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-30',
  ariaLabel,
  className,
  onClick,
  ...props
}) => {
  return (
    <div className={cn('flex items-center gap-3 select-none', positionClassName)}>
      {label && (
        <button
          type="button"
          onClick={onClick}
          className="bg-surface-container-lowest/95 backdrop-blur text-on-surface font-sans text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-md border border-outline-variant/30 hover:bg-surface-container active:scale-95 transition-all"
        >
          {label}
        </button>
      )}
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'h-14 w-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center transition-all duration-200',
          'hover:bg-[#285237] hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className
        )}
        aria-label={ariaLabel || (label ? `Botón ${label}` : 'Acción flotante')}
        {...props}
      >
        {icon}
      </button>
    </div>
  )
}
