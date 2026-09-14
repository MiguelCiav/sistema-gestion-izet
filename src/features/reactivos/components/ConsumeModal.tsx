import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, Search, ArrowLeft } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { NumberStepper } from '../../../components/ui/NumberStepper'
import { NFPA704Diamond } from '../../../components/ui/NFPA704Diamond'
import type { ReagentItem, ConsumeReagentInput } from '../services/reagentsService'

export interface ConsumeModalProps {
  isOpen: boolean
  onClose: () => void
  reagent: ReagentItem | null
  availableReagents: ReagentItem[]
  activeLabId: string | null
  activeLabCodigo?: 'LEPA' | 'LEM'
  defaultUserName?: string
  onConfirmConsume: (
    input: ConsumeReagentInput
  ) => Promise<{ success: boolean; error: string | null; data?: unknown }>
}

export const ConsumeModal: React.FC<ConsumeModalProps> = ({
  isOpen,
  onClose,
  reagent,
  availableReagents,
  activeLabId,
  activeLabCodigo = 'LEPA',
  defaultUserName = '',
  onConfirmConsume,
}) => {
  const [selectedReagent, setSelectedReagent] = useState<ReagentItem | null>(reagent)
  const [searchPicker, setSearchPicker] = useState('')
  const [cantidad, setCantidad] = useState<number>(1)
  const [motivo, setMotivo] = useState('')
  const [responsable, setResponsable] = useState(defaultUserName)
  const [repeatConsume, setRepeatConsume] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setSelectedReagent(reagent)
      setCantidad(1)
      setMotivo('')
      setResponsable(defaultUserName)
      setErrorMsg(null)
      setSuccessMsg(null)
      setSearchPicker('')
    }
  }, [isOpen, reagent, defaultUserName])

  const stockActual = selectedReagent?.stock?.cantidad_actual ?? 0
  const unidadMedida = selectedReagent?.stock?.unidad_medida || 'ml'

  // Reagents available for consumption (having stock > 0 in active lab)
  const pickableReagents = availableReagents.filter((r) => {
    const hasStock = r.stock && r.stock.cantidad_actual > 0
    if (!hasStock) return false
    if (!searchPicker.trim()) return true
    const q = searchPicker.toLowerCase().trim()
    return (
      r.nombre.toLowerCase().includes(q) ||
      r.codigo_unico.toLowerCase().includes(q) ||
      (r.formula_quimica?.toLowerCase().includes(q) ?? false)
    )
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReagent || !activeLabId) {
      setErrorMsg('No se ha seleccionado un reactivo o laboratorio válido')
      return
    }

    if (cantidad <= 0) {
      setErrorMsg('La cantidad a consumir debe ser estrictamente mayor a cero')
      return
    }

    if (cantidad > stockActual) {
      setErrorMsg(
        `No puedes consumir más de la existencia disponible (${stockActual} ${unidadMedida})`
      )
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    const result = await onConfirmConsume({
      reactivo_id: selectedReagent.id,
      laboratorio_id: activeLabId,
      cantidad,
      motivo: motivo.trim() || undefined,
      nombre_responsable: responsable.trim() || undefined,
    })

    setIsSubmitting(false)

    if (!result.success || result.error) {
      setErrorMsg(result.error || 'Error al procesar el consumo de stock')
      return
    }

    const feedback = `Se registró el consumo de ${cantidad} ${unidadMedida} de ${selectedReagent.nombre}.`
    setSuccessMsg(feedback)

    if (repeatConsume) {
      // Keep modal open, reset fields for next consumption
      setCantidad(1)
      setMotivo('')
      setTimeout(() => setSuccessMsg(null), 3500)
    } else {
      setTimeout(() => {
        onClose()
      }, 1200)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Registro de Consumo"
    >
      <div className="flex flex-col space-y-5 text-left">
        {/* Step 1: Reagent Picker if no reagent was selected */}
        {!selectedReagent ? (
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-primary">
              ¿Qué reactivo consumiste?
            </h3>
            <p className="text-xs sm:text-sm font-sans text-on-surface-variant">
              Selecciona el reactivo del inventario de {activeLabCodigo} del cual realizaste el egreso.
            </p>

            <div className="relative">
              <Input
                value={searchPicker}
                onChange={(e) => setSearchPicker(e.target.value)}
                placeholder="Buscar por nombre, código o fórmula..."
                leftIcon={<Search className="h-4 w-4 text-on-surface-variant" />}
                className="w-full"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {pickableReagents.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-surface-container border border-outline-variant/30 text-secondary text-sm">
                  No hay reactivos con existencias disponibles que coincidan con la búsqueda.
                </div>
              ) : (
                pickableReagents.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedReagent(r)
                      setCantidad(1)
                      setErrorMsg(null)
                    }}
                    className="w-full p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 border-l-4 border-l-primary flex items-center justify-between text-left transition-all shadow-xs group"
                  >
                    <div>
                      <h4 className="font-sans font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                        {r.nombre}
                      </h4>
                      <p className="font-mono text-xs text-secondary mt-0.5">
                        Cod: {r.codigo_unico} / Stock: {r.stock?.cantidad_actual} {r.stock?.unidad_medida}
                      </p>
                    </div>
                    <div className="shrink-0 pl-2">
                      <NFPA704Diamond
                        salud={r.nfpa_salud}
                        inflamabilidad={r.nfpa_inflamabilidad}
                        inestabilidad={r.nfpa_inestabilidad}
                        especial={r.nfpa_especial}
                        size="sm"
                      />
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="pt-2">
              <Button variant="ghost" isFullWidth onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Wireframe CONSUMO _ DETALLE.png */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header / Back to picker if not fixed */}
            {!reagent && (
              <button
                type="button"
                onClick={() => setSelectedReagent(null)}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-secondary hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Elegir otro reactivo
              </button>
            )}

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-primary text-center">
              ¿Cuánto consumiste?
            </h3>

            {/* Selected Reagent Card (Matching wireframe) */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 border-l-4 border-l-primary flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-base text-on-surface">
                  {selectedReagent.nombre}
                </h4>
                <p className="font-mono text-xs sm:text-sm text-secondary">
                  Cod: {selectedReagent.codigo_unico} / Stock: {stockActual} {unidadMedida}
                </p>
                {selectedReagent.formula_quimica && (
                  <p className="font-mono text-xs text-on-surface-variant">
                    Fórmula: {selectedReagent.formula_quimica}
                  </p>
                )}
              </div>
              <div className="shrink-0 pl-3">
                <NFPA704Diamond
                  salud={selectedReagent.nfpa_salud}
                  inflamabilidad={selectedReagent.nfpa_inflamabilidad}
                  inestabilidad={selectedReagent.nfpa_inestabilidad}
                  especial={selectedReagent.nfpa_especial}
                  size="md"
                />
              </div>
            </div>

            {/* Number Stepper (Matching Wireframe) */}
            <div className="py-2 flex flex-col items-center">
              <NumberStepper
                value={cantidad}
                onChange={(val) => {
                  setCantidad(val)
                  if (errorMsg) setErrorMsg(null)
                }}
                min={1}
                max={stockActual}
                step={1}
                unit={unidadMedida}
              />
              <span className="text-xs font-sans text-secondary mt-2">
                Existencia disponible: <strong className="text-on-surface">{stockActual} {unidadMedida}</strong>
              </span>
            </div>

            {/* Motivo / Proyecto del consumo */}
            <div className="space-y-1.5">
              <label
                htmlFor="consume-motivo"
                className="text-xs font-sans font-semibold text-on-surface"
              >
                Proyecto, asignatura o motivo del consumo:
              </label>
              <textarea
                id="consume-motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej. Análisis de muestras de agua, práctica docente Bioquímica I..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>

            {/* Responsable (Opcional / Pre-llenado) */}
            <div className="space-y-1.5">
              <label
                htmlFor="consume-responsable"
                className="text-xs font-sans font-semibold text-on-surface"
              >
                Responsable del consumo:
              </label>
              <Input
                id="consume-responsable"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                placeholder="Nombre del usuario o investigador"
                className="w-full text-sm"
              />
            </div>

            {/* Feedback Banners */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-xs font-sans flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-error shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Checkbox: Registrar otro consumo (Matching wireframe) */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="repeat-consume-checkbox"
                checked={repeatConsume}
                onChange={(e) => setRepeatConsume(e.target.checked)}
                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="repeat-consume-checkbox"
                className="text-xs font-sans text-on-surface select-none cursor-pointer"
              >
                Registrar otro consumo después de confirmar este.
              </label>
            </div>

            {/* Action buttons (Volver / Confirmar) */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                isFullWidth
                onClick={() => (reagent ? onClose() : setSelectedReagent(null))}
                disabled={isSubmitting}
              >
                Volver
              </Button>
              <Button
                type="submit"
                variant="primary"
                isFullWidth
                isLoading={isSubmitting}
                disabled={cantidad <= 0 || cantidad > stockActual}
              >
                Confirmar
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
