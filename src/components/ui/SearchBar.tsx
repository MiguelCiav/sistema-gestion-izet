import React from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFilterClick?: () => void
  isFilterActive?: boolean
  placeholder?: string
  className?: string
  showFilterButton?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onFilterClick,
  isFilterActive = false,
  placeholder = 'Buscar...',
  className,
  showFilterButton = true,
}) => {
  return (
    <div className={cn('flex items-center gap-2 sm:gap-3 w-full', className)}>
      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[46px] rounded-xl pl-4 pr-11 py-2.5 font-sans text-sm sm:text-base text-on-surface bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none transition-colors"
        />
        <span className="absolute right-3.5 text-on-surface-variant/70 pointer-events-none flex items-center justify-center">
          <Search className="h-4 w-4" />
        </span>
      </div>

      {showFilterButton && onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          aria-label="Filtrar resultados"
          className={cn(
            'h-[46px] w-[46px] rounded-xl flex items-center justify-center border transition-all duration-200 shrink-0',
            isFilterActive
              ? 'bg-primary text-on-primary border-primary shadow-sm'
              : 'bg-surface-container-lowest border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary active:scale-95'
          )}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
