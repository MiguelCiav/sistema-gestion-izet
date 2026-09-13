import React from 'react'
import { Package, ClipboardList, ArrowLeftRight, LayoutGrid } from 'lucide-react'
import { cn } from '../../lib/utils'

export type NavTabId = 'inventario' | 'bitacora' | 'prestamos' | 'dashboard'

export interface NavTabItem {
  id: NavTabId
  label: string
  icon: React.ReactNode
}

export interface BottomNavigationProps {
  activeTab: NavTabId
  onTabChange: (tabId: NavTabId) => void
  className?: string
}

const defaultTabs: NavTabItem[] = [
  {
    id: 'inventario',
    label: 'Inventario',
    icon: <Package className="h-5 w-5 stroke-[2.2]" />,
  },
  {
    id: 'bitacora',
    label: 'Bitácora',
    icon: <ClipboardList className="h-5 w-5 stroke-[2.2]" />,
  },
  {
    id: 'prestamos',
    label: 'Préstamos',
    icon: <ArrowLeftRight className="h-5 w-5 stroke-[2.2]" />,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutGrid className="h-5 w-5 stroke-[2.2]" />,
  },
]

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur border-t border-outline-variant/30 py-1.5 px-3 select-none safe-bottom shadow-lg',
        className
      )}
      aria-label="Navegación principal"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {defaultTabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 group relative',
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={cn(
                  'h-8 w-14 rounded-full flex items-center justify-center transition-all duration-200 mb-0.5',
                  isActive
                    ? 'bg-primary-container/40 text-primary scale-105'
                    : 'bg-transparent text-on-surface-variant/80 group-hover:bg-surface-container/50'
                )}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] font-sans tracking-tight">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
