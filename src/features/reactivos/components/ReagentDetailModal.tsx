import React, { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { NFPA704Diamond } from '../../../components/ui/NFPA704Diamond'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { ReagentItem } from '../services/reagentsService'
import { getReagentStockStatus } from '../services/reagentsService'
import { ShieldAlert, Tag, Calendar, DollarSign, MapPin, Package, AlertTriangle, Layers } from 'lucide-react'

export interface ReagentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  reagent: ReagentItem | null
  onEdit?: (reagent: ReagentItem) => void
  onOpenStockModal?: (reagent: ReagentItem) => void
  onDeactivate?: (id: string) => Promise<unknown>
  activeLabCodigo?: 'LEPA' | 'LEM'
}

export const ReagentDetailModal: React.FC<ReagentDetailModalProps> = ({
  isOpen,
  onClose,
  reagent,
  onEdit,
  onOpenStockModal,
  onDeactivate,
  activeLabCodigo = 'LEPA',
}) => {
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [showConfirmDeactivate, setShowConfirmDeactivate] = useState(false)

  if (!reagent) return null

  const stock = reagent.stock
  const formattedPrice = reagent.ultimo_precio
    ? `${reagent.moneda_precio === 'USD' ? '$' : 'Bs. '}${Number(reagent.ultimo_precio).toFixed(2)} ${reagent.moneda_precio}`
    : 'No registrado'

  const handleDeactivate = async () => {
    if (!onDeactivate) return
    setIsDeactivating(true)
    await onDeactivate(reagent.id)
    setIsDeactivating(false)
    setShowConfirmDeactivate(false)
  }

  const stockStatus = getReagentStockStatus(reagent)

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title="Detalle del Reactivo">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Large Centered NFPA 704 Diamond (Matching Wireframe) */}
        <div className="py-2 flex justify-center">
          <NFPA704Diamond
            salud={reagent.nfpa_salud}
            inflamabilidad={reagent.nfpa_inflamabilidad}
            inestabilidad={reagent.nfpa_inestabilidad}
            especial={reagent.nfpa_especial}
            size="lg"
          />
        </div>

        {/* Header with Title & Formula */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            {reagent.nombre}
          </h2>
          {reagent.formula_quimica && (
            <p className="font-mono text-sm sm:text-base font-semibold text-secondary mt-1">
              {reagent.formula_quimica}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            <StatusBadge variant="neutral" label={reagent.clasificacion_riesgo} />
            {reagent.es_regulado && (
              <StatusBadge variant="regulado" label="Sustancia Regulada" />
            )}
            {reagent.es_uso_comun && (
              <StatusBadge variant="comun" label="Insumo de Uso Común" />
            )}
            {!reagent.activo && <StatusBadge variant="alerta" label="Dado de Baja" />}
          </div>
        </div>

        {/* Regulatory entities if applicable */}
        {reagent.es_regulado && reagent.entidades_regulatorias.length > 0 && (
          <div className="w-full p-3 rounded-xl bg-error-container/40 border border-error/20 text-left text-xs font-sans text-on-error-container">
            <span className="font-bold flex items-center gap-1.5 mb-1 text-error">
              <ShieldAlert className="h-4 w-4" /> Entidades Fiscalizadoras:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {reagent.entidades_regulatorias.map((ent, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-error/10 text-error font-semibold text-[11px]"
                >
                  {ent}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Values List - Replicating Wireframe Inputs/Panels */}
        <div className="w-full space-y-3 text-left">
          {/* Código Institucional */}
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-sans font-medium text-on-surface-variant flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" /> Código Único
            </span>
            <span className="font-mono font-bold text-sm sm:text-base text-primary">
              {reagent.codigo_unico}
            </span>
          </div>

          {/* Stock Disponible en Laboratorio Activo con Indicador HU07 */}
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-sans font-medium text-on-surface-variant flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Stock disponible ({activeLabCodigo})
            </span>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-sm sm:text-base text-on-surface">
                {stock ? `${stock.cantidad_actual} ${stock.unidad_medida}` : '0 (Sin existencia)'}
              </span>
              {stockStatus === 'ESCASEZ' ? (
                <StatusBadge variant="alerta" label="En Escasez" size="sm" />
              ) : (
                <StatusBadge variant="disponible" label="Disponible" size="sm" />
              )}
            </div>
          </div>

          {/* Umbral Mínimo */}
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-sans font-medium text-on-surface-variant flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#705c30]" /> Umbral Mínimo
            </span>
            <span className="font-sans font-semibold text-sm sm:text-base text-on-surface">
              {stock ? `${stock.umbral_minimo} ${stock.unidad_medida}` : 'No definido'}
            </span>
          </div>

          {/* Lote (si existe) */}
          {stock?.lote && (
            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-sans font-medium text-on-surface-variant flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" /> Número de Lote
              </span>
              <span className="font-mono font-medium text-xs sm:text-sm text-on-surface">
                {stock.lote}
              </span>
            </div>
          )}

          {/* Fecha de Vencimiento */}
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-sans font-medium text-on-surface-variant flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Fecha de vencimiento
            </span>
            <span className="font-sans font-medium text-sm sm:text-base text-on-surface">
              {stock?.fecha_vencimiento
                ? new Date(stock.fecha_vencimiento).toLocaleDateString('es-VE')
                : 'No registrada'}
            </span>
          </div>

          {/* Ubicación Física */}
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-sans font-medium text-on-surface-variant flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Ubicación
            </span>
            <span className="font-sans font-medium text-xs sm:text-sm text-on-surface text-right truncate max-w-[200px]">
              {stock?.ubicacion_fisica || 'No asignada'}
            </span>
          </div>

          {/* Último Precio Adquirido */}
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-sans font-medium text-on-surface-variant flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" /> Último precio adquirido
            </span>
            <span className="font-sans font-semibold text-xs sm:text-sm text-on-surface">
              {formattedPrice}
            </span>
          </div>
        </div>

        {/* Confirmation alert for deactivation */}
        {showConfirmDeactivate && (
          <div className="w-full p-4 rounded-xl bg-[#fdf4dc] border border-[#dec38e] border-l-4 border-l-[#705c30] text-left space-y-3 shadow-xs">
            <p className="text-xs sm:text-sm font-sans text-[#251a00] font-medium">
              ¿Estás seguro de que deseas dar de baja este reactivo? Dejará de mostrarse en el inventario activo sin perder su trazabilidad histórica ni stock.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmDeactivate(false)}
                disabled={isDeactivating}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeactivate}
                isLoading={isDeactivating}
              >
                Confirmar Baja
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full pt-3 flex flex-col sm:flex-row gap-3">
          {onOpenStockModal && (
            <Button
              variant="secondary"
              isFullWidth
              onClick={() => {
                onClose()
                onOpenStockModal(reagent)
              }}
              leftIcon={<Package className="h-4 w-4" />}
            >
              Gestionar Stock
            </Button>
          )}

          {onEdit && (
            <Button
              variant="primary"
              isFullWidth
              onClick={() => {
                onClose()
                onEdit(reagent)
              }}
            >
              Editar Reactivo
            </Button>
          )}

          {reagent.activo && onDeactivate && !showConfirmDeactivate && (
            <Button
              variant="outline"
              isFullWidth
              onClick={() => setShowConfirmDeactivate(true)}
            >
              Dar de Baja
            </Button>
          )}

          <Button variant="ghost" isFullWidth onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
