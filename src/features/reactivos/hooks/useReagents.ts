import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  reagentsService,
  type ReagentItem,
  type ReagentFilters,
  type CreateReagentInput,
  type CatalogoReactivoUpdate,
} from '../services/reagentsService'
import { useLab } from '../../laboratorios'

export const useReagents = () => {
  const { activeLabId } = useLab()

  const [reagents, setReagents] = useState<ReagentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ReagentFilters>({
    soloRegulados: false,
    soloUsoComun: false,
    incluirInactivos: false,
  })

  // Modals state
  const [selectedReagent, setSelectedReagent] = useState<ReagentItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReagent, setEditingReagent] = useState<ReagentItem | null>(null)

  const loadReagents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await reagentsService.getReagents(activeLabId, filters)
      setReagents(data)
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

    // Mutations
    createReagent: handleCreateReagent,
    updateReagent: handleUpdateReagent,
    deactivateReagent: handleDeactivateReagent,
    deleteReagent: handleDeleteReagent,
    checkCodeAvailability: reagentsService.checkCodeAvailability.bind(reagentsService),
  }
}
