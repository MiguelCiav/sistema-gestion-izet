import React from 'react'
import { NFPA704Diamond } from '../../../components/ui/NFPA704Diamond'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { type ReagentItem, getReagentStockStatus } from '../services/reagentsService'
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
  const stockStatus = getReagentStockStatus(reagent)
  const isLowStock = stockStatus === 'ESCASEZ'
  const isNoStock = stockStatus === 'SIN_EXISTENCIA'

  const stockText = reagent.stock
    ? `${reagent.stock.cantidad_actual} ${reagent.stock.unidad_medida}`
    : '0 / Sin existencias'

  const borderClass = !reagent.activo
    ? 'border-l-outline'
    : isNoStock
    ? 'border-l-error'
    : isLowStock
    ? 'border-l-amber-500'
    : 'border-l-primary'

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
        'group relative w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border-l-4 border border-outline-variant/30 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer select-none text-left',
        borderClass,
        !reagent.activo && 'opacity-60 bg-surface-container/50',
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
              isNoStock
                ? 'text-error'
                : isLowStock
                ? 'text-amber-700'
                : 'text-primary'
            )}
          >
            {stockText}
          </span>
        </p>

        {reagent.stock?.ubicacion_fisica && (
          <p className="text-[11px] font-sans text-on-surface-variant/70 mt-0.5 truncate">
            📍 {reagent.stock.ubicacion_fisica}
          </p>
        )}

        {/* Badges row */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {reagent.es_regulado && (
            <StatusBadge variant="regulado" size="sm" />
          )}
          {reagent.es_uso_comun && (
            <StatusBadge variant="comun" size="sm" />
          )}
          {isNoStock && (
            <StatusBadge variant="critico" label="Sin existencias" size="sm" />
          )}
          {isLowStock && (
            <StatusBadge variant="alerta" label="Escasea" size="sm" />
          )}
          {!isNoStock && !isLowStock && reagent.stock && (
            <StatusBadge variant="disponible" label="Disponible" size="sm" />
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
