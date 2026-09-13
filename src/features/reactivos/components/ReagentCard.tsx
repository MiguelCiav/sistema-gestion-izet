import React from 'react'
import { NFPA704Diamond } from '../../../components/ui/NFPA704Diamond'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { ReagentItem } from '../services/reagentsService'
import { cn } from '../../../lib/utils'

export interface ReagentCardProps {
  reagent: ReagentItem
  onClick?: (reagent: ReagentItem) => void
  className?: string
}

export const ReagentCard: React.FC<ReagentCardProps> = ({
  reagent,
  onClick,
  className,
}) => {
  const stockText = reagent.stock
    ? `${reagent.stock.cantidad_actual}${reagent.stock.unidad_medida}`
    : '0 / Sin existencias'

  const isLowStock =
    reagent.stock &&
    reagent.stock.cantidad_actual > 0 &&
    reagent.stock.cantidad_actual <= reagent.stock.umbral_minimo

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(reagent)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(reagent)
        }
      }}
      className={cn(
        'group relative w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border-l-4 border-l-primary border border-outline-variant/30 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer select-none text-left',
        !reagent.activo && 'opacity-60 bg-surface-container/50 border-l-outline',
        className
      )}
    >
      {/* Left info column */}
      <div className="flex-1 pr-4 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-sans font-bold text-base sm:text-lg text-on-surface truncate group-hover:text-primary transition-colors">
            {reagent.nombre}
          </h3>
          {reagent.formula_quimica && (
            <span className="text-xs font-mono font-medium text-on-surface-variant/80 bg-surface-container px-1.5 py-0.5 rounded">
              {reagent.formula_quimica}
            </span>
          )}
        </div>

        <p className="font-sans text-xs sm:text-sm text-on-surface-variant/90 font-medium">
          Cod: <span className="font-bold text-on-surface">{reagent.codigo_unico}</span> / Stock:{' '}
          <span
            className={cn(
              'font-semibold',
              isLowStock ? 'text-amber-700' : 'text-on-surface'
            )}
          >
            {stockText}
          </span>
        </p>

        {/* Badges row */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {reagent.es_regulado && (
            <StatusBadge variant="regulado" size="sm" />
          )}
          {reagent.es_uso_comun && (
            <StatusBadge variant="comun" size="sm" />
          )}
          {isLowStock && (
            <StatusBadge variant="alerta" size="sm" />
          )}
          {!reagent.activo && (
            <StatusBadge variant="neutral" label="Inactivo" size="sm" />
          )}
        </div>
      </div>

      {/* Right NFPA 704 Diamond */}
      <div className="flex-shrink-0 pl-2">
        <NFPA704Diamond
          salud={reagent.nfpa_salud}
          inflamabilidad={reagent.nfpa_inflamabilidad}
          inestabilidad={reagent.nfpa_inestabilidad}
          especial={reagent.nfpa_especial}
          size="sm"
        />
      </div>
    </div>
  )
}
