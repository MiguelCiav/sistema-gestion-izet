import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        className={cn(
          'relative w-full bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200',
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-outline-variant/30">
          <div>
            {title && (
              <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-xs sm:text-sm text-on-surface-variant font-sans">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1 rounded-xl text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto font-sans text-sm text-on-surface">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-5 bg-surface-container-low/50 border-t border-outline-variant/30 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
