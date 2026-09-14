import React from 'react'
import { ArrowDownRight, ArrowUpRight, RefreshCcw, ArrowLeftRight, Trash2 } from 'lucide-react'
import { NFPA704Diamond } from '../../../components/ui/NFPA704Diamond'
import type { BitacoraEntry } from '../services/bitacoraService'

export interface BitacoraCardProps {
  entry: BitacoraEntry
  onClick?: (entry: BitacoraEntry) => void
}

export const BitacoraCard: React.FC<BitacoraCardProps> = ({ entry, onClick }) => {
  const { tipo_movimiento, cantidad, unidad_medida, stock_anterior, stock_posterior, reactivo } =
    entry

  const getMovementConfig = () => {
    switch (tipo_movimiento) {
      case 'CONSUMO':
        return {
          borderClass: 'border-l-amber-600',
          badgeBg: 'bg-amber-100 text-[#705c30] border-amber-300',
          quantityPrefix: '-',
          quantityClass: 'text-[#705c30]',
          label: 'Consumo',
          icon: <ArrowDownRight className="h-3.5 w-3.5 stroke-[2.5]" />,
        }
      case 'INGRESO':
        return {
          borderClass: 'border-l-primary',
          badgeBg: 'bg-emerald-100 text-primary border-emerald-300',
          quantityPrefix: '+',
          quantityClass: 'text-primary',
          label: 'Ingreso',
          icon: <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />,
        }
      case 'AJUSTE':
        return {
          borderClass: 'border-l-secondary',
          badgeBg: 'bg-stone-200 text-secondary border-stone-300',
          quantityPrefix: '',
          quantityClass: 'text-secondary',
          label: 'Ajuste',
          icon: <RefreshCcw className="h-3.5 w-3.5 stroke-[2.5]" />,
        }
      case 'PRESTAMO_SALIDA':
        return {
          borderClass: 'border-l-blue-600',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
          quantityPrefix: '-',
          quantityClass: 'text-blue-800',
          label: 'Préstamo Salida',
          icon: <ArrowLeftRight className="h-3.5 w-3.5 stroke-[2.5]" />,
        }
      case 'PRESTAMO_RETORNO':
        return {
          borderClass: 'border-l-blue-600',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
          quantityPrefix: '+',
          quantityClass: 'text-blue-800',
          label: 'Préstamo Retorno',
          icon: <ArrowLeftRight className="h-3.5 w-3.5 stroke-[2.5]" />,
        }
      case 'BAJA':
        return {
          borderClass: 'border-l-error',
          badgeBg: 'bg-red-100 text-error border-red-300',
          quantityPrefix: '-',
          quantityClass: 'text-error',
          label: 'Baja',
          icon: <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />,
        }
      default:
        return {
          borderClass: 'border-l-outline-variant',
          badgeBg: 'bg-surface-container text-on-surface-variant border-outline-variant',
          quantityPrefix: '',
          quantityClass: 'text-on-surface',
          label: tipo_movimiento,
          icon: null,
        }
    }
  }

  const config = getMovementConfig()

  // Format date and time
  const dateObj = new Date(entry.created_at)
  const formattedTime = dateObj.toLocaleTimeString('es-VE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(entry)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(entry)
        }
      }}
      className={`w-full p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 border-l-4 ${config.borderClass} text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/30`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Movement Type Badge & Time */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold border ${config.badgeBg}`}
            >
              {config.icon}
              {config.label}
            </span>
            <span className="text-[11px] font-sans text-secondary font-medium">
              {formattedTime}
            </span>
          </div>

          {/* Reagent Title */}
          <h4 className="font-sans font-bold text-sm sm:text-base text-on-surface truncate">
            {config.label} de {reactivo?.nombre || 'Reactivo'}
          </h4>

          {/* Reagent Code & Formula */}
          <div className="flex items-center gap-2 text-xs font-mono text-secondary">
            <span>Cod: {reactivo?.codigo_unico || 'S/C'}</span>
            {reactivo?.formula_quimica && (
              <>
                <span>•</span>
                <span>{reactivo.formula_quimica}</span>
              </>
            )}
          </div>

          {/* Stock Trajectory: Anterior -> Posterior */}
          <div className="pt-1 flex items-center gap-2 text-xs font-sans text-on-surface-variant">
            <span>
              Stock: {stock_anterior} {unidad_medida} ➔{' '}
              <strong className="text-on-surface">
                {stock_posterior} {unidad_medida}
              </strong>
            </span>
          </div>

          {/* Responsable & Motivo */}
          <div className="pt-0.5 text-xs font-sans text-secondary space-y-0.5">
            <p>
              Responsable:{' '}
              <span className="font-semibold text-on-surface">
                {entry.nombre_responsable || 'Personal de Laboratorio'}
              </span>
            </p>
            {entry.motivo && (
              <p className="italic line-clamp-1 text-on-surface-variant/80">
                &ldquo;{entry.motivo}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Quantity & NFPA Diamond (Right side) */}
        <div className="flex flex-col items-end justify-between shrink-0 space-y-2">
          <span className={`font-mono text-base sm:text-lg font-extrabold ${config.quantityClass}`}>
            {config.quantityPrefix}
            {cantidad} {unidad_medida}
          </span>

          {reactivo && (
            <NFPA704Diamond
              salud={reactivo.nfpa_salud}
              inflamabilidad={reactivo.nfpa_inflamabilidad}
              inestabilidad={reactivo.nfpa_inestabilidad}
              especial={reactivo.nfpa_especial}
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  )
}
