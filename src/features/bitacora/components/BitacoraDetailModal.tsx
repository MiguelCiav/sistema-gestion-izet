import React from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { NFPA704Diamond } from '../../../components/ui/NFPA704Diamond'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { User, Calendar, Layers, FileText, ArrowRight } from 'lucide-react'
import type { BitacoraEntry } from '../services/bitacoraService'

export interface BitacoraDetailModalProps {
  isOpen: boolean
  onClose: () => void
  entry: BitacoraEntry | null
}

export const BitacoraDetailModal: React.FC<BitacoraDetailModalProps> = ({
  isOpen,
  onClose,
  entry,
}) => {
  if (!entry) return null

  const { reactivo } = entry
  const dateObj = new Date(entry.created_at)
  const formattedDate = dateObj.toLocaleDateString('es-VE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = dateObj.toLocaleTimeString('es-VE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Registro de Bitácora"
      description="Historial inmutable de auditoría institucional (Solo Lectura)"
    >
      <div className="space-y-5 text-left">
        {/* Reagent Overview Card */}
        {reactivo && (
          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-base text-on-surface">
                {reactivo.nombre}
              </h3>
              <p className="font-mono text-xs text-secondary">
                Cod: {reactivo.codigo_unico}
                {reactivo.formula_quimica ? ` • ${reactivo.formula_quimica}` : ''}
              </p>
              {reactivo.clasificacion_riesgo && (
                <div className="pt-1">
                  <StatusBadge variant="neutral" label={reactivo.clasificacion_riesgo} size="sm" />
                </div>
              )}
            </div>
            <div className="shrink-0 pl-3">
              <NFPA704Diamond
                salud={reactivo.nfpa_salud}
                inflamabilidad={reactivo.nfpa_inflamabilidad}
                inestabilidad={reactivo.nfpa_inestabilidad}
                especial={reactivo.nfpa_especial}
                size="md"
              />
            </div>
          </div>
        )}

        {/* Read-Only Detail Fields (Matching wireframe BITÁCORA _ CONSUMO.png) */}
        <div className="space-y-3.5">
          {/* Responsable */}
          <div className="space-y-1">
            <label className="text-xs font-sans font-semibold text-on-surface flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-secondary" /> Responsable:
            </label>
            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-sm font-sans text-on-surface font-medium">
              {entry.nombre_responsable || 'Personal de Laboratorio'}
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="space-y-1">
            <label className="text-xs font-sans font-semibold text-on-surface flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-secondary" /> Fecha y Hora del Movimiento:
            </label>
            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-sm font-sans text-on-surface">
              {formattedDate} a las {formattedTime}
            </div>
          </div>

          {/* Tipo de Movimiento y Cantidad */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-sans font-semibold text-on-surface">
                Tipo de Movimiento:
              </label>
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-sm font-sans font-bold text-primary">
                {entry.tipo_movimiento}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-sans font-semibold text-on-surface">
                Cantidad Afectada:
              </label>
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-sm font-mono font-bold text-on-surface">
                {entry.cantidad} {entry.unidad_medida}
              </div>
            </div>
          </div>

          {/* Stock Trajectory Card */}
          <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-1">
            <span className="text-xs font-sans font-semibold text-secondary flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Variación del Stock Físico:
            </span>
            <div className="flex items-center gap-2 text-sm font-mono">
              <span className="text-on-surface-variant">
                Stock Anterior: <strong>{entry.stock_anterior} {entry.unidad_medida}</strong>
              </span>
              <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              <span className="text-primary font-bold">
                Stock Resultante: {entry.stock_posterior} {entry.unidad_medida}
              </span>
            </div>
          </div>

          {/* Observaciones / Motivo */}
          <div className="space-y-1">
            <label className="text-xs font-sans font-semibold text-on-surface flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-secondary" /> Observaciones / Motivo:
            </label>
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-sm font-sans text-on-surface min-h-[4rem] whitespace-pre-wrap">
              {entry.motivo || 'Sin observaciones registradas.'}
            </div>
          </div>
        </div>

        {/* Action Button: Volver */}
        <div className="pt-2">
          <Button variant="primary" isFullWidth onClick={onClose}>
            Volver a la Bitácora
          </Button>
        </div>
      </div>
    </Modal>
  )
}
