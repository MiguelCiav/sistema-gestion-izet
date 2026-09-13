import React from 'react'
import { Settings, FlaskConical, Building2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface TopBarProps {
  currentLab?: 'LEPA' | 'LEM' | string
  onSwitchLab?: (lab: 'LEPA' | 'LEM') => void
  onSettingsClick?: () => void
  userName?: string
  className?: string
}

export const TopBar: React.FC<TopBarProps> = ({
  currentLab = 'LEPA',
  onSwitchLab,
  onSettingsClick,
  userName,
  className,
}) => {
  return (
    <header
      className={cn(
        'w-full sticky top-0 z-30 bg-surface-warm/95 backdrop-blur border-b border-outline-variant/30 px-4 sm:px-6 py-3 flex items-center justify-between',
        className
      )}
    >
      {/* Brand & Lab Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          <span className="font-display text-xl sm:text-2xl font-bold text-primary tracking-tight">
            Terra Lab
          </span>
        </div>

        {/* Laboratory Switcher / Pill */}
        {onSwitchLab ? (
          <div className="inline-flex bg-surface-container-high rounded-full p-0.5 border border-outline-variant/40 ml-2">
            <button
              type="button"
              onClick={() => onSwitchLab('LEPA')}
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-sans font-bold transition-all',
                currentLab === 'LEPA'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              LEPA
            </button>
            <button
              type="button"
              onClick={() => onSwitchLab('LEM')}
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-sans font-bold transition-all',
                currentLab === 'LEM'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              LEM
            </button>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 bg-surface-container-high text-primary px-2.5 py-0.5 rounded-full text-xs font-sans font-bold border border-outline-variant/30 ml-2">
            <Building2 className="h-3 w-3" />
            {currentLab}
          </span>
        )}
      </div>

      {/* Right Actions: User Name & Settings */}
      <div className="flex items-center gap-3">
        {userName && (
          <span className="hidden sm:inline-block text-xs font-sans font-semibold text-on-surface-variant">
            {userName}
          </span>
        )}
        {onSettingsClick && (
          <button
            type="button"
            onClick={onSettingsClick}
            aria-label="Configuración"
            className="p-2 rounded-xl text-on-surface-variant/80 hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  )
}
