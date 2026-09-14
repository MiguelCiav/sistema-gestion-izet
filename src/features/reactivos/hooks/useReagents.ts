import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  reagentsService,
  type ReagentItem,
  type ReagentFilters,
  type CreateReagentInput,
  type CatalogoReactivoUpdate,
  type UpsertStockInput,
  type StockAlert,
  type ConsumeReagentInput,
} from '../services/reagentsService'
import { useLab } from '../../laboratorios'

export const useReagents = () => {
  const { activeLabId } = useLab()

  const [reagents, setReagents] = useState<ReagentItem[]>([])
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ReagentFilters>({
    soloRegulados: false,
    soloUsoComun: false,
    soloEscasez: false,
    soloSinExistencia: false,
    incluirInactivos: false,
  })

  // Modals state
  const [selectedReagent, setSelectedReagent] = useState<ReagentItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReagent, setEditingReagent] = useState<ReagentItem | null>(null)

  // Stock Modal state (HU04)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)
  const [stockReagent, setStockReagent] = useState<ReagentItem | null>(null)

  // Consume Modal state (HU05)
  const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false)
  const [reagentToConsume, setReagentToConsume] = useState<ReagentItem | null>(null)

  const loadReagents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [data, alerts] = await Promise.all([
        reagentsService.getReagents(activeLabId, filters),
        reagentsService.getStockAlerts(activeLabId),
      ])
      setReagents(data)
      setStockAlerts(alerts)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar catálogo de reactivos'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [activeLabId, filters])

  useEffect(() => {
    loadReagents()
  }, [loadReagents])

  // Filtered reagents by search query (name, code, formula)
  const filteredReagents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return reagents

    return reagents.filter((r) => {
      const matchName = r.nombre.toLowerCase().includes(query)
      const matchCode = r.codigo_unico.toLowerCase().includes(query)
      const matchFormula = r.formula_quimica?.toLowerCase().includes(query) ?? false
      const matchRisk = r.clasificacion_riesgo.toLowerCase().includes(query)
      return matchName || matchCode || matchFormula || matchRisk
    })
  }, [reagents, searchQuery])

  // Actions
  const handleOpenDetail = (reagent: ReagentItem) => {
    setSelectedReagent(reagent)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedReagent(null)
  }

  const handleOpenCreate = () => {
    setEditingReagent(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (reagent: ReagentItem) => {
    setEditingReagent(reagent)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingReagent(null)
  }

  const handleCreateReagent = async (input: CreateReagentInput) => {
    const result = await reagentsService.createReagent(input, activeLabId)
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    await loadReagents()
    handleCloseForm()
    return { success: true, error: null }
  }

  const handleUpdateReagent = async (id: string, updates: CatalogoReactivoUpdate) => {
    const result = await reagentsService.updateReagent(id, updates)
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    await loadReagents()
    if (selectedReagent?.id === id) {
      setSelectedReagent((prev) => (prev ? { ...prev, ...updates } : null))
    }
    handleCloseForm()
    return { success: true, error: null }
  }

  const handleDeactivateReagent = async (id: string) => {
    const result = await reagentsService.deactivateReagent(id)
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    await loadReagents()
    handleCloseDetail()
    return { success: true, error: null }
  }

  const handleDeleteReagent = async (id: string) => {
    const result = await reagentsService.deleteReagent(id)
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    await loadReagents()
    handleCloseDetail()
    return { success: true, error: null }
  }

  const handleOpenStockModal = (reagent: ReagentItem) => {
    setStockReagent(reagent)
    setIsStockModalOpen(true)
  }

  const handleCloseStockModal = () => {
    setIsStockModalOpen(false)
    setStockReagent(null)
  }

  const handleUpsertStock = async (input: UpsertStockInput) => {
    const result = await reagentsService.upsertStock(input)
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    await loadReagents()
    if (selectedReagent?.id === input.reactivo_id && result.data) {
      setSelectedReagent((prev) =>
        prev
          ? {
              ...prev,
              stock: {
                id: result.data!.id,
                laboratorio_id: result.data!.laboratorio_id,
                cantidad_actual: Number(result.data!.cantidad_actual),
                unidad_medida: result.data!.unidad_medida,
                ubicacion_fisica: result.data!.ubicacion_fisica,
                umbral_minimo: Number(result.data!.umbral_minimo),
                fecha_vencimiento: result.data!.fecha_vencimiento,
                lote: result.data!.lote,
                ultimo_precio_adquirido: result.data!.ultimo_precio_adquirido
                  ? Number(result.data!.ultimo_precio_adquirido)
                  : null,
                moneda_precio: result.data!.moneda_precio,
                es_uso_comun: result.data!.es_uso_comun,
                estado_fisico: result.data!.estado_fisico,
              },
            }
          : null
      )
    }
    handleCloseStockModal()
    return { success: true, error: null }
  }

  const handleOpenConsume = (reagent?: ReagentItem) => {
    setReagentToConsume(reagent || null)
    setIsConsumeModalOpen(true)
  }

  const handleCloseConsume = () => {
    setIsConsumeModalOpen(false)
    setReagentToConsume(null)
  }

  const handleConsumeReagent = async (input: ConsumeReagentInput) => {
    const result = await reagentsService.consumeReagent(input)
    if (!result.success || result.error) {
      return { success: false, error: result.error || 'Error al registrar consumo' }
    }
    await loadReagents()
    if (selectedReagent?.id === input.reactivo_id && result.data) {
      setSelectedReagent((prev) =>
        prev
          ? {
              ...prev,
              stock: prev.stock
                ? {
                    ...prev.stock,
                    cantidad_actual: result.data!.stock_posterior,
                    estado_fisico: result.data!.estado_fisico,
                  }
                : null,
            }
          : null
      )
    }
    return { success: true, error: null, data: result.data }
  }

  const toggleFilter = (key: keyof ReagentFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return {
    reagents: filteredReagents,
    allReagents: reagents,
    totalCount: reagents.length,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    toggleFilter,
    reloadReagents: loadReagents,

    // Detail modal
    selectedReagent,
    isDetailOpen,
    openDetail: handleOpenDetail,
    closeDetail: handleCloseDetail,

    // Form modal
    isFormOpen,
    editingReagent,
    openCreate: handleOpenCreate,
    openEdit: handleOpenEdit,
    closeForm: handleCloseForm,

    // Stock modal (HU04)
    isStockModalOpen,
    stockReagent,
    openStockModal: handleOpenStockModal,
    closeStockModal: handleCloseStockModal,
    upsertStock: handleUpsertStock,

    // Consume modal (HU05)
    isConsumeModalOpen,
    reagentToConsume,
    openConsume: handleOpenConsume,
    closeConsume: handleCloseConsume,
    consumeReagent: handleConsumeReagent,

    // Stock Alerts (HU07)
    stockAlerts,

    // Mutations
    createReagent: handleCreateReagent,
    updateReagent: handleUpdateReagent,
    deactivateReagent: handleDeactivateReagent,
    deleteReagent: handleDeleteReagent,
    checkCodeAvailability: reagentsService.checkCodeAvailability.bind(reagentsService),
  }
}
