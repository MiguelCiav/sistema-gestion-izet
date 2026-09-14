import React, { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Checkbox } from '../../../components/ui/Checkbox'
import { Button } from '../../../components/ui/Button'
import { NFPA704Diamond } from '../../../components/ui/NFPA704Diamond'
import type { ReagentItem, CreateReagentInput, CatalogoReactivoUpdate } from '../services/reagentsService'
import { Check, X, AlertCircle } from 'lucide-react'

export interface ReagentFormModalProps {
  isOpen: boolean
  onClose: () => void
  reagentToEdit?: ReagentItem | null
  onSubmitCreate: (data: CreateReagentInput) => Promise<{ success: boolean; error: string | null }>
  onSubmitUpdate: (id: string, data: CatalogoReactivoUpdate) => Promise<{ success: boolean; error: string | null }>
  onCheckCodeAvailability: (code: string, excludeId?: string) => Promise<{ isAvailable: boolean }>
  activeLabCodigo?: 'LEPA' | 'LEM'
}

const RIESGO_OPTIONS = [
  { value: 'Corrosivo', label: 'Corrosivo' },
  { value: 'Inflamable', label: 'Inflamable' },
  { value: 'Tóxico', label: 'Tóxico' },
  { value: 'Irritante', label: 'Irritante' },
  { value: 'Oxidante', label: 'Oxidante' },
  { value: 'Explosivo', label: 'Explosivo' },
  { value: 'Peligro para la salud', label: 'Peligro para la salud' },
  { value: 'Bajo Riesgo', label: 'Bajo Riesgo' },
]

const NFPA_LEVELS = [
  { value: '0', label: '0 - Mínimo' },
  { value: '1', label: '1 - Ligero' },
  { value: '2', label: '2 - Moderado' },
  { value: '3', label: '3 - Alto' },
  { value: '4', label: '4 - Extremo' },
]

const NFPA_SPECIAL_OPTIONS = [
  { value: '', label: 'Ninguno' },
  { value: 'W', label: '<s>W</s> (Reactivo con agua)' },
  { value: 'OX', label: 'OX (Oxidante)' },
  { value: 'SA', label: 'SA (Gas asfixiante simple)' },
  { value: 'COR', label: 'COR (Corrosivo)' },
  { value: 'BIO', label: 'BIO (Riesgo biológico)' },
  { value: 'RAD', label: 'RAD (Radiactivo)' },
]

export const ReagentFormModal: React.FC<ReagentFormModalProps> = ({
  isOpen,
  onClose,
  reagentToEdit,
  onSubmitCreate,
  onSubmitUpdate,
  onCheckCodeAvailability,
  activeLabCodigo = 'LEPA',
}) => {
  const isEditing = !!reagentToEdit

  // Form Fields
  const [codigoUnico, setCodigoUnico] = useState('')
  const [nombre, setNombre] = useState('')
  const [formulaQuimica, setFormulaQuimica] = useState('')
  const [clasificacionRiesgo, setClasificacionRiesgo] = useState('Corrosivo')

  // NFPA 704
  const [nfpaSalud, setNfpaSalud] = useState(0)
  const [nfpaInflamabilidad, setNfpaInflamabilidad] = useState(0)
  const [nfpaInestabilidad, setNfpaInestabilidad] = useState(0)
  const [nfpaEspecial, setNfpaEspecial] = useState('')

  // Regulation & Common Use
  const [esRegulado, setEsRegulado] = useState(false)
  const [entidades, setEntidades] = useState<string[]>([])
  const [nuevaEntidad, setNuevaEntidad] = useState('')
  const [esUsoComun, setEsUsoComun] = useState(false)

  // Price
  const [ultimoPrecio, setUltimoPrecio] = useState<string>('')
  const [monedaPrecio, setMonedaPrecio] = useState<'USD' | 'VES'>('USD')
  const [fechaUltimoPrecio, setFechaUltimoPrecio] = useState('')

  // Initial Stock (only for create mode)
  const [incluirStockInicial, setIncluirStockInicial] = useState(true)
  const [cantidadInicial, setCantidadInicial] = useState('1000')
  const [unidadMedida, setUnidadMedida] = useState('ml')
  const [ubicacionFisica, setUbicacionFisica] = useState('Gabinete Principal')
  const [umbralMinimo, setUmbralMinimo] = useState('250')

  // Code Validation State
  const [isCodeAvailable, setIsCodeAvailable] = useState<boolean | null>(null)
  const [isCheckingCode, setIsCheckingCode] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync form on open / reagent change
  useEffect(() => {
    if (reagentToEdit) {
      setCodigoUnico(reagentToEdit.codigo_unico)
      setNombre(reagentToEdit.nombre)
      setFormulaQuimica(reagentToEdit.formula_quimica || '')
      setClasificacionRiesgo(reagentToEdit.clasificacion_riesgo)
      setNfpaSalud(reagentToEdit.nfpa_salud)
      setNfpaInflamabilidad(reagentToEdit.nfpa_inflamabilidad)
      setNfpaInestabilidad(reagentToEdit.nfpa_inestabilidad)
      setNfpaEspecial(reagentToEdit.nfpa_especial || '')
      setEsRegulado(reagentToEdit.es_regulado)
      setEntidades(reagentToEdit.entidades_regulatorias || [])
      setEsUsoComun(reagentToEdit.es_uso_comun ?? false)
      setUltimoPrecio(reagentToEdit.ultimo_precio ? String(reagentToEdit.ultimo_precio) : '')
      setMonedaPrecio(reagentToEdit.moneda_precio === 'VES' ? 'VES' : 'USD')
      setFechaUltimoPrecio(reagentToEdit.fecha_ultimo_precio || '')
      setIsCodeAvailable(true)
    } else {
      setCodigoUnico('')
      setNombre('')
      setFormulaQuimica('')
      setClasificacionRiesgo('Corrosivo')
      setNfpaSalud(0)
      setNfpaInflamabilidad(0)
      setNfpaInestabilidad(0)
      setNfpaEspecial('')
      setEsRegulado(false)
      setEntidades([])
      setEsUsoComun(false)
      setUltimoPrecio('')
      setMonedaPrecio('USD')
      setFechaUltimoPrecio('')
      setIsCodeAvailable(null)
      setIncluirStockInicial(true)
      setCantidadInicial('1000')
      setUnidadMedida('ml')
      setUbicacionFisica('Gabinete Principal')
      setUmbralMinimo('250')
    }
    setSubmitError(null)
  }, [reagentToEdit, isOpen])

  // Real-time debounce for code uniqueness check (HU03 Criterio 2)
  useEffect(() => {
    const trimmed = codigoUnico.trim()
    if (!trimmed) {
      setIsCodeAvailable(null)
      return
    }

    if (isEditing && trimmed.toUpperCase() === reagentToEdit?.codigo_unico.toUpperCase()) {
      setIsCodeAvailable(true)
      return
    }

    setIsCheckingCode(true)
    const timeoutId = setTimeout(async () => {
      try {
        const { isAvailable } = await onCheckCodeAvailability(trimmed, reagentToEdit?.id)
        setIsCodeAvailable(isAvailable)
      } finally {
        setIsCheckingCode(false)
      }
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [codigoUnico, isEditing, reagentToEdit, onCheckCodeAvailability])

  const handleAddEntidad = () => {
    const trimmed = nuevaEntidad.trim().toUpperCase()
    if (trimmed && !entidades.includes(trimmed)) {
      setEntidades([...entidades, trimmed])
      setNuevaEntidad('')
    }
  }

  const handleRemoveEntidad = (ent: string) => {
    setEntidades(entidades.filter((e) => e !== ent))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!codigoUnico.trim()) {
      setSubmitError('El código único del reactivo es obligatorio.')
      return
    }

    if (isCodeAvailable === false) {
      setSubmitError('El código ingresado ya existe. Por favor ingrese un código único.')
      return
    }

    if (!nombre.trim()) {
      setSubmitError('El nombre del reactivo es obligatorio.')
      return
    }

    if (!formulaQuimica.trim()) {
      setSubmitError('La fórmula química es obligatoria.')
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && reagentToEdit) {
        const result = await onSubmitUpdate(reagentToEdit.id, {
          codigo_unico: codigoUnico.trim().toUpperCase(),
          nombre: nombre.trim(),
          formula_quimica: formulaQuimica.trim() || null,
          clasificacion_riesgo: clasificacionRiesgo,
          nfpa_salud: Number(nfpaSalud),
          nfpa_inflamabilidad: Number(nfpaInflamabilidad),
          nfpa_inestabilidad: Number(nfpaInestabilidad),
          nfpa_especial: nfpaEspecial.trim() || null,
          es_regulado: esRegulado,
          entidades_regulatorias: entidades,
          es_uso_comun: esUsoComun,
          ultimo_precio: ultimoPrecio ? parseFloat(ultimoPrecio) : null,
          moneda_precio: monedaPrecio,
          fecha_ultimo_precio: fechaUltimoPrecio || null,
        })

        if (!result.success) {
          setSubmitError(result.error || 'Error al actualizar reactivo.')
        }
      } else {
        const createData: CreateReagentInput = {
          codigo_unico: codigoUnico.trim().toUpperCase(),
          nombre: nombre.trim(),
          formula_quimica: formulaQuimica.trim() || null,
          clasificacion_riesgo: clasificacionRiesgo,
          nfpa_salud: Number(nfpaSalud),
          nfpa_inflamabilidad: Number(nfpaInflamabilidad),
          nfpa_inestabilidad: Number(nfpaInestabilidad),
          nfpa_especial: nfpaEspecial.trim() || null,
          es_regulado: esRegulado,
          entidades_regulatorias: entidades,
          es_uso_comun: esUsoComun,
          ultimo_precio: ultimoPrecio ? parseFloat(ultimoPrecio) : null,
          moneda_precio: monedaPrecio,
          fecha_ultimo_precio: fechaUltimoPrecio || null,
          activo: true,
          ...(incluirStockInicial
            ? {
                stockInicial: {
                  cantidad_actual: parseFloat(cantidadInicial) || 0,
                  unidad_medida: unidadMedida.trim() || 'ml',
                  ubicacion_fisica: ubicacionFisica.trim() || 'Gabinete Principal',
                  umbral_minimo: parseFloat(umbralMinimo) || 0,
                },
              }
            : {}),
        }

        const result = await onSubmitCreate(createData)
        if (!result.success) {
          setSubmitError(result.error || 'Error al registrar reactivo.')
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={isEditing ? 'Editar Reactivo' : 'Añadir Nuevo Reactivo'}
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>
        {submitError && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-sans font-medium flex items-center gap-2 border border-error/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-error" />
            <span>{submitError}</span>
          </div>
        )}

        {/* 1. Datos Identificatorios */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
            1. Identificación y Clasificación
          </h4>

          <div className="relative">
            <Input
              label="Código Único Institucional"
              placeholder="Ej: RCT-HCL-01"
              value={codigoUnico}
              onChange={(e) => setCodigoUnico(e.target.value.toUpperCase())}
              disabled={isSubmitting}
              required
              helperText={
                isCheckingCode
                  ? 'Verificando código...'
                  : isCodeAvailable === true
                  ? 'Código disponible'
                  : isCodeAvailable === false
                  ? 'Este código ya está registrado en el catálogo'
                  : 'Identificador único estándar compartido entre LEPA y LEM'
              }
              error={isCodeAvailable === false ? 'Este código ya está registrado en el catálogo' : undefined}
            />
            <div className="absolute right-3 top-9 flex items-center pointer-events-none">
              {isCodeAvailable === true && (
                <span className="text-primary flex items-center gap-1 text-xs font-bold">
                  <Check className="h-4 w-4" /> Disponible
                </span>
              )}
              {isCodeAvailable === false && (
                <span className="text-error flex items-center gap-1 text-xs font-bold">
                  <X className="h-4 w-4" /> Duplicado
                </span>
              )}
            </div>
          </div>

          <Input
            label="Nombre del Reactivo"
            placeholder="Ej: Ácido Clorhídrico 37%"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Fórmula Química"
              placeholder="Ej: HCl"
              value={formulaQuimica}
              onChange={(e) => setFormulaQuimica(e.target.value)}
              disabled={isSubmitting}
              required
            />

            <Select
              label="Clasificación de Riesgo"
              value={clasificacionRiesgo}
              onChange={(e) => setClasificacionRiesgo(e.target.value)}
              options={RIESGO_OPTIONS}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* 2. Rombo NFPA 704 Interactivo */}
        <div className="space-y-3.5 pt-2 border-t border-outline-variant/30">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
              2. Rombo de Seguridad NFPA 704
            </h4>
            <span className="text-xs text-on-surface-variant font-medium">
              Ajusta los 4 cuadrantes estándar
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
            <div className="flex-shrink-0 flex flex-col items-center">
              <NFPA704Diamond
                salud={Number(nfpaSalud)}
                inflamabilidad={Number(nfpaInflamabilidad)}
                inestabilidad={Number(nfpaInestabilidad)}
                especial={nfpaEspecial || null}
                size="md"
              />
              <span className="mt-2 text-[11px] font-sans font-medium text-on-surface-variant">
                Vista previa
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Select
                label="Salud (Azul)"
                value={String(nfpaSalud)}
                onChange={(e) => setNfpaSalud(Number(e.target.value))}
                options={NFPA_LEVELS}
                disabled={isSubmitting}
              />

              <Select
                label="Inflamabilidad (Rojo)"
                value={String(nfpaInflamabilidad)}
                onChange={(e) => setNfpaInflamabilidad(Number(e.target.value))}
                options={NFPA_LEVELS}
                disabled={isSubmitting}
              />

              <Select
                label="Inestabilidad (Amarillo)"
                value={String(nfpaInestabilidad)}
                onChange={(e) => setNfpaInestabilidad(Number(e.target.value))}
                options={NFPA_LEVELS}
                disabled={isSubmitting}
              />

              <Select
                label="Especial (Blanco)"
                value={nfpaEspecial}
                onChange={(e) => setNfpaEspecial(e.target.value)}
                options={NFPA_SPECIAL_OPTIONS}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* 3. Normativa y Uso Compartido */}
        <div className="space-y-4 pt-2 border-t border-outline-variant/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
            3. Control Regulatorio y Alcance
          </h4>

          <div className="space-y-3 p-3.5 rounded-xl bg-surface-container/40 border border-outline-variant/30">
            <Checkbox
              label="Sustancia Regulada / Fiscalizada"
              checked={esRegulado}
              onChange={(e) => setEsRegulado(e.target.checked)}
              disabled={isSubmitting}
            />

            {esRegulado && (
              <div className="pt-2 pl-6 space-y-2 animate-in fade-in duration-150">
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar entidad (ej: RESQUIMIC, CICPC)"
                    value={nuevaEntidad}
                    onChange={(e) => setNuevaEntidad(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddEntidad()
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleAddEntidad}
                    disabled={!nuevaEntidad.trim() || isSubmitting}
                  >
                    Añadir
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {entidades.map((ent) => (
                    <span
                      key={ent}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-error-container text-on-error-container text-xs font-semibold"
                    >
                      {ent}
                      <button
                        type="button"
                        onClick={() => handleRemoveEntidad(ent)}
                        className="hover:text-error transition-colors"
                        aria-label={`Eliminar ${ent}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Checkbox
                label="Insumo de Uso Común (habilitado para préstamos inter-laboratorios LEPA / LEM)"
                checked={esUsoComun}
                onChange={(e) => setEsUsoComun(e.target.checked)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* 4. Precio Referencial de Reposición */}
        <div className="space-y-3 pt-2 border-t border-outline-variant/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
            4. Último Precio Adquirido (Referencial)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              type="number"
              step="0.01"
              min="0"
              label="Monto"
              placeholder="0.00"
              value={ultimoPrecio}
              onChange={(e) => setUltimoPrecio(e.target.value)}
              disabled={isSubmitting}
            />

            <Select
              label="Moneda"
              value={monedaPrecio}
              onChange={(e) => setMonedaPrecio(e.target.value as 'USD' | 'VES')}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'VES', label: 'VES (Bs.)' },
              ]}
              disabled={isSubmitting}
            />

            <Input
              type="date"
              label="Fecha del Precio"
              value={fechaUltimoPrecio}
              onChange={(e) => setFechaUltimoPrecio(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* 5. Stock Inicial para el Laboratorio Activo (sólo en creación) */}
        {!isEditing && (
          <div className="space-y-3 pt-2 border-t border-outline-variant/30">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                5. Existencia Física Inicial ({activeLabCodigo})
              </h4>
              <Checkbox
                label="Registrar stock ahora"
                checked={incluirStockInicial}
                onChange={(e) => setIncluirStockInicial(e.target.checked)}
                disabled={isSubmitting}
              />
            </div>

            {incluirStockInicial && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-xl bg-surface-container/40 border border-outline-variant/30">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    label="Cantidad"
                    value={cantidadInicial}
                    onChange={(e) => setCantidadInicial(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <div className="w-28">
                    <Select
                      label="Unidad"
                      value={unidadMedida}
                      onChange={(e) => setUnidadMedida(e.target.value)}
                      options={[
                        { value: 'ml', label: 'ml' },
                        { value: 'L', label: 'L' },
                        { value: 'g', label: 'g' },
                        { value: 'kg', label: 'kg' },
                        { value: 'frascos', label: 'frascos' },
                      ]}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <Input
                  label="Umbral Mínimo Alerta"
                  type="number"
                  min="0"
                  step="0.1"
                  value={umbralMinimo}
                  onChange={(e) => setUmbralMinimo(e.target.value)}
                  disabled={isSubmitting}
                  required
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Ubicación Física en Laboratorio"
                    placeholder="Ej: Gabinete de Ácidos 1 - Repisa B"
                    value={ubicacionFisica}
                    onChange={(e) => setUbicacionFisica(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-outline-variant/30">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isCodeAvailable === false || isCheckingCode}
          >
            {isEditing ? 'Guardar Cambios' : 'Registrar Reactivo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
