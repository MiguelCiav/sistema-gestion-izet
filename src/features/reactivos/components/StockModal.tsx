import React, { useState, useEffect } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Save, Package } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { ReagentItem, UpsertStockInput } from '../services/reagentsService'

export interface StockModalProps {
  isOpen: boolean
  onClose: () => void
  reagent: ReagentItem | null
  activeLabCodigo: 'LEPA' | 'LEM'
  activeLabId: string | null
  onSubmitStock: (input: UpsertStockInput) => Promise<{ success: boolean; error: string | null }>
}

const UNIDADES_MEDIDA = [
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (L)' },
  { value: 'mg', label: 'Miligramos (mg)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'unidades', label: 'Unidades / Frascos' },
]

export const StockModal: React.FC<StockModalProps> = ({
  isOpen,
  onClose,
  reagent,
  activeLabCodigo,
  activeLabId,
  onSubmitStock,
}) => {
  const [cantidadActual, setCantidadActual] = useState('')
  const [unidadMedida, setUnidadMedida] = useState('ml')
  const [ubicacionFisica, setUbicacionFisica] = useState('')
  const [umbralMinimo, setUmbralMinimo] = useState('')
  const [lote, setLote] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [ultimoPrecio, setUltimoPrecio] = useState('')
  const [monedaPrecio, setMonedaPrecio] = useState<'USD' | 'VES'>('USD')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (reagent && isOpen) {
      const stock = reagent.stock
      if (stock) {
        setCantidadActual(String(stock.cantidad_actual))
        setUnidadMedida(stock.unidad_medida || 'ml')
        setUbicacionFisica(stock.ubicacion_fisica || '')
        setUmbralMinimo(String(stock.umbral_minimo))
        setLote(stock.lote || '')
        setFechaVencimiento(stock.fecha_vencimiento || '')
        setUltimoPrecio(
          stock.ultimo_precio_adquirido !== null && stock.ultimo_precio_adquirido !== undefined
            ? String(stock.ultimo_precio_adquirido)
            : reagent.ultimo_precio
            ? String(reagent.ultimo_precio)
            : ''
        )
        const resolvedCurrency = stock.moneda_precio || reagent.moneda_precio
        setMonedaPrecio(resolvedCurrency === 'VES' ? 'VES' : 'USD')
      } else {
        setCantidadActual('')
        setUnidadMedida('ml')
        setUbicacionFisica('')
        setUmbralMinimo('100')
        setLote('')
        setFechaVencimiento('')
        setUltimoPrecio(reagent.ultimo_precio ? String(reagent.ultimo_precio) : '')
        setMonedaPrecio(reagent.moneda_precio === 'VES' ? 'VES' : 'USD')
      }
      setSubmitError(null)
    }
  }, [reagent, isOpen])

  if (!reagent) return null

  // HU07: Determinación en tiempo real del estado de stock proyectado
  const numCantidad = parseFloat(cantidadActual) || 0
  const numUmbral = parseFloat(umbralMinimo) || 0
  const hasCantidad = cantidadActual.trim() !== ''

  const getStatusPreview = () => {
    if (!hasCantidad || numCantidad <= 0) {
      return {
        variant: 'critico' as const,
        label: 'Sin existencias (0)',
        message: 'El reactivo quedará registrado sin stock disponible.',
        icon: <AlertCircle className="h-4 w-4 text-error" />,
      }
    }
    if (numCantidad <= numUmbral) {
      return {
        variant: 'alerta' as const,
        label: 'Escasez (Bajo umbral)',
        message: `El stock (${numCantidad} ${unidadMedida}) es menor o igual al umbral (${numUmbral} ${unidadMedida}). Se generará una alerta de stock mínimo.`,
        icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
      }
    }
    return {
      variant: 'disponible' as const,
      label: 'Stock Óptimo (Disponible)',
      message: `El stock supera el umbral mínimo (${numUmbral} ${unidadMedida}). No se activarán alertas.`,
      icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
    }
  }

  const statusPreview = getStatusPreview()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!activeLabId) {
      setSubmitError('No se identificó el laboratorio activo.')
      return
    }

    if (!ubicacionFisica.trim()) {
      setSubmitError('La ubicación física detallada es obligatoria.')
      return
    }

    if (isNaN(numCantidad) || numCantidad < 0) {
      setSubmitError('La cantidad física actual debe ser un número mayor o igual a 0.')
      return
    }

    if (isNaN(numUmbral) || numUmbral < 0) {
      setSubmitError('El umbral mínimo debe ser un número mayor o igual a 0.')
      return
    }

    if (fechaVencimiento && isNaN(Date.parse(fechaVencimiento))) {
      setSubmitError('La fecha de vencimiento ingresada no es válida.')
      return
    }

    const parsedPrecio = ultimoPrecio.trim() ? parseFloat(ultimoPrecio) : null
    if (parsedPrecio !== null && (isNaN(parsedPrecio) || parsedPrecio < 0)) {
      setSubmitError('El último precio adquirido debe ser un valor numérico positivo.')
      return
    }

    setIsSubmitting(true)
    try {
      const input: UpsertStockInput = {
        reactivo_id: reagent.id,
        laboratorio_id: activeLabId,
        cantidad_actual: numCantidad,
        unidad_medida: unidadMedida,
        ubicacion_fisica: ubicacionFisica.trim(),
        umbral_minimo: numUmbral,
        fecha_vencimiento: fechaVencimiento.trim() || null,
        lote: lote.trim() || null,
        ultimo_precio_adquirido: parsedPrecio,
        moneda_precio: monedaPrecio,
      }

      const result = await onSubmitStock(input)
      if (!result.success) {
        setSubmitError(result.error || 'Error al guardar el stock.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={`Gestionar Stock — ${reagent.codigo_unico}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left" noValidate>
        {/* Cabecera contextual */}
        <div className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-sm font-bold text-on-surface truncate">
              {reagent.nombre}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-sans text-on-surface-variant">
                Sede:{' '}
                <strong className="text-primary font-bold">{activeLabCodigo}</strong>
              </span>
              <span className="text-outline-variant">•</span>
              {reagent.es_uso_comun ? (
                <StatusBadge variant="comun" label="Uso Común" />
              ) : (
                <StatusBadge variant="neutral" label="Uso Exclusivo" />
              )}
            </div>
          </div>
        </div>

        {submitError && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-sans font-medium flex items-center gap-2 border border-error/20">
            <AlertCircle className="h-4 w-4 shrink-0 text-error" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Campos Principales de Stock Físico (HU04 Criterio 2) */}
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Cantidad Física Actual"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={cantidadActual}
              onChange={(e) => setCantidadActual(e.target.value)}
              disabled={isSubmitting}
              required
              helperText="Existencia física disponible en sede"
            />

            <Select
              label="Unidad de Medida"
              value={unidadMedida}
              onChange={(e) => setUnidadMedida(e.target.value)}
              options={UNIDADES_MEDIDA}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Umbral Mínimo de Alerta"
              type="number"
              min="0"
              step="any"
              placeholder="Ej: 100"
              value={umbralMinimo}
              onChange={(e) => setUmbralMinimo(e.target.value)}
              disabled={isSubmitting}
              required
              helperText="Dispara alerta de escasez si stock ≤ umbral"
            />

            <Input
              label="Ubicación Física Detallada"
              placeholder="Ej: Gabinete de Ácidos 1 - Estante B"
              value={ubicacionFisica}
              onChange={(e) => setUbicacionFisica(e.target.value)}
              disabled={isSubmitting}
              required
              helperText="Armario, gabinete, estante o refrigerador"
            />
          </div>
        </div>

        {/* Indicador en tiempo real del estado de alerta (HU07) */}
        <div className="p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 flex items-start gap-2.5">
          <div className="mt-0.5">{statusPreview.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface font-sans">
                Condición Proyectada:
              </span>
              <StatusBadge variant={statusPreview.variant} label={statusPreview.label} />
            </div>
            <p className="text-[11px] font-sans text-on-surface-variant mt-0.5">
              {statusPreview.message}
            </p>
          </div>
        </div>

        {/* Lote, Vencimiento y Valoración Económica (HU04 Criterios 3 y 4) */}
        <div className="space-y-3 pt-1 border-t border-outline-variant/20">
          <h5 className="text-xs font-bold uppercase tracking-wider text-secondary font-sans">
            Trazabilidad y Valoración Económica
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Número de Lote (Opcional)"
              placeholder="Ej: L-HCL-2026-A"
              value={lote}
              onChange={(e) => setLote(e.target.value)}
              disabled={isSubmitting}
            />

            <Input
              label="Fecha de Vencimiento (Opcional)"
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Último Precio Adquirido"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 45.00"
              value={ultimoPrecio}
              onChange={(e) => setUltimoPrecio(e.target.value)}
              disabled={isSubmitting}
              helperText="Costo de reposición por lote o frasco"
            />

            <Select
              label="Moneda de Adquisición"
              value={monedaPrecio}
              onChange={(e) => setMonedaPrecio(e.target.value as 'USD' | 'VES')}
              options={[
                { value: 'USD', label: 'Dólares (USD $)' },
                { value: 'VES', label: 'Bolívares (VES Bs.)' },
              ]}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Guardar Stock Físico
          </Button>
        </div>
      </form>
    </Modal>
  )
}
