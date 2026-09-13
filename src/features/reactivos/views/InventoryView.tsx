import React, { useState } from 'react'
import { TopBar } from '../../../components/ui/TopBar'
import { BottomNavigation, type NavTabId } from '../../../components/ui/BottomNavigation'
import { SearchBar } from '../../../components/ui/SearchBar'
import { FloatingActionButton } from '../../../components/ui/FloatingActionButton'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { ReagentCard } from '../components/ReagentCard'
import { ReagentDetailModal } from '../components/ReagentDetailModal'
import { ReagentFormModal } from '../components/ReagentFormModal'
import { StockModal } from '../components/StockModal'
import { useReagents } from '../hooks/useReagents'
import { useLab } from '../../laboratorios'
import { useAuth } from '../../auth'
import {
  SlidersHorizontal,
  Plus,
  FlaskConical,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  LogOut,
  User,
  Shield,
} from 'lucide-react'

export interface InventoryViewProps {
  onNavigate?: (tab: NavTabId) => void
  currentTab?: NavTabId
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  onNavigate,
  currentTab = 'inventario',
}) => {
  const { activeLab, activeLabId, switchLab, activeLabNombre } = useLab()
  const { user, profile, signOut, isGuest } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSignOut = async () => {
    setIsSettingsOpen(false)
    await signOut()
  }

  const {
    reagents,
    totalCount,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
    reloadReagents,
    selectedReagent,
    isDetailOpen,
    openDetail,
    closeDetail,
    isFormOpen,
    editingReagent,
    openCreate,
    openEdit,
    closeForm,
    createReagent,
    updateReagent,
    deactivateReagent,
    checkCodeAvailability,
    isStockModalOpen,
    stockReagent,
    openStockModal,
    closeStockModal,
    upsertStock,
    stockAlerts,
  } = useReagents()

  return (
    <div className="min-h-screen bg-surface-warm flex flex-col text-on-surface">
      {/* TopBar with Active Lab Selector & User Session */}
      <TopBar
        currentLab={activeLab}
        onSwitchLab={switchLab}
        userName={profile?.nombre_completo || (isGuest ? 'Invitado' : 'Usuario')}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-28">
        {/* Title Header Matching Wireframe */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Inventario
            </h1>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Sede activa:{' '}
              <span className="font-bold text-primary">{activeLab}</span> — {activeLabNombre}
            </p>
          </div>

          <button
            type="button"
            onClick={reloadReagents}
            className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
            title="Recargar catálogo"
            aria-label="Recargar catálogo"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>

        {/* Active stock alerts banner (HU07) */}
        {stockAlerts.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-left">
            <div className="flex items-center gap-2 text-xs font-sans font-semibold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                {stockAlerts.length} alerta{stockAlerts.length > 1 ? 's' : ''} de reactivos en {activeLab}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowFilters(true)
                if (!filters.soloEscasez && !filters.soloSinExistencia) {
                  toggleFilter('soloEscasez')
                }
              }}
              className="text-xs font-sans font-bold text-amber-800 dark:text-amber-300 hover:underline shrink-0"
            >
              Filtrar escasez
            </button>
          </div>
        )}

        {/* Search Bar and Filters Toggle Row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por nombre, código o fórmula..."
              className="w-full"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            aria-label="Filtros de búsqueda"
            className={`flex items-center justify-center h-11 w-11 rounded-xl border transition-all duration-150 ${
              showFilters ||
              filters.soloRegulados ||
              filters.soloUsoComun ||
              filters.soloEscasez ||
              filters.soloSinExistencia
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/50 hover:bg-surface-container'
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Filter Chips (Collapsible / Toggleable) */}
        {showFilters && (
          <div className="mb-4 p-3 rounded-xl bg-surface-container/60 border border-outline-variant/30 flex flex-wrap gap-2 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-on-surface-variant self-center mr-1">
              Filtros:
            </span>

            <button
              type="button"
              aria-label="Filtro solo regulados"
              onClick={() => toggleFilter('soloRegulados')}
              className="transition-transform active:scale-95"
            >
              <StatusBadge
                variant={filters.soloRegulados ? 'regulado' : 'neutral'}
                label={filters.soloRegulados ? '✓ Regulados' : 'Regulados'}
                className="cursor-pointer"
              />
            </button>

            <button
              type="button"
              aria-label="Filtro solo uso común"
              onClick={() => toggleFilter('soloUsoComun')}
              className="transition-transform active:scale-95"
            >
              <StatusBadge
                variant={filters.soloUsoComun ? 'comun' : 'neutral'}
                label={filters.soloUsoComun ? '✓ Uso Común' : 'Uso Común'}
                className="cursor-pointer"
              />
            </button>

            <button
              type="button"
              aria-label="Filtro solo escasez"
              onClick={() => toggleFilter('soloEscasez')}
              className="transition-transform active:scale-95"
            >
              <StatusBadge
                variant={filters.soloEscasez ? 'alerta' : 'neutral'}
                label={filters.soloEscasez ? '✓ En Escasez' : 'En Escasez'}
                className="cursor-pointer"
              />
            </button>

            <button
              type="button"
              aria-label="Filtro solo sin existencias"
              onClick={() => toggleFilter('soloSinExistencia')}
              className="transition-transform active:scale-95"
            >
              <StatusBadge
                variant={filters.soloSinExistencia ? 'critico' : 'neutral'}
                label={filters.soloSinExistencia ? '✓ Sin Existencias' : 'Sin Existencias'}
                className="cursor-pointer"
              />
            </button>

            <button
              type="button"
              aria-label="Filtro incluir inactivos"
              onClick={() => toggleFilter('incluirInactivos')}
              className="transition-transform active:scale-95"
            >
              <StatusBadge
                variant={filters.incluirInactivos ? 'alerta' : 'neutral'}
                label={filters.incluirInactivos ? '✓ Con Inactivos' : 'Solo Activos'}
                className="cursor-pointer"
              />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-error-container text-on-error-container text-xs font-sans font-medium flex items-center gap-2 border border-error/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-error" />
            <span>{error}</span>
          </div>
        )}

        {/* Reagents List */}
        {isLoading && reagents.length === 0 ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-24 w-full rounded-2xl bg-surface-container animate-pulse border border-outline-variant/20"
              />
            ))}
          </div>
        ) : reagents.length > 0 ? (
          <div className="space-y-3.5">
            {reagents.map((reagent) => (
              <ReagentCard
                key={reagent.id}
                reagent={reagent}
                onClick={openDetail}
              />
            ))}

            <p className="text-center text-xs font-sans text-on-surface-variant/70 pt-4 pb-2">
              Mostrando {reagents.length} de {totalCount} reactivos en catálogo
            </p>
          </div>
        ) : (
          /* Empty State */
          <div className="py-12 px-4 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-4">
              <FlaskConical className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-lg font-bold text-on-surface mb-1">
              No se encontraron reactivos
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-xs mb-5">
              {searchQuery || filters.soloRegulados || filters.soloUsoComun
                ? 'No hay resultados que coincidan con los criterios de búsqueda o filtros aplicados.'
                : 'Aún no hay reactivos registrados en el catálogo institucional.'}
            </p>
            {searchQuery || filters.soloRegulados || filters.soloUsoComun ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  toggleFilter('soloRegulados')
                  toggleFilter('soloUsoComun')
                }}
                className="text-xs font-sans font-bold text-primary hover:underline"
              >
                Limpiar búsqueda y filtros
              </button>
            ) : (
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm"
              >
                <Plus className="h-4 w-4" /> Registrar Primer Reactivo
              </button>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button (Matching Wireframe: 'Añadir Reactivo') */}
      <FloatingActionButton
        label="Añadir Reactivo"
        icon={<Plus className="h-6 w-6 stroke-[2.5]" />}
        onClick={openCreate}
        className="bottom-20 right-4 sm:right-8 z-20 shadow-lg"
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={currentTab}
        onTabChange={(tab) => onNavigate?.(tab)}
      />

      {/* Reagent Detail Modal */}
      <ReagentDetailModal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        reagent={selectedReagent}
        onEdit={(reagent) => openEdit(reagent)}
        onOpenStockModal={(reagent) => openStockModal(reagent)}
        onDeactivate={deactivateReagent}
        activeLabCodigo={activeLab}
      />

      {/* Stock Management Modal (HU04) */}
      <StockModal
        isOpen={isStockModalOpen}
        onClose={closeStockModal}
        reagent={stockReagent}
        activeLabCodigo={activeLab}
        activeLabId={activeLabId}
        onSubmitStock={upsertStock}
      />

      {/* Reagent Create / Edit Form Modal */}
      <ReagentFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        reagentToEdit={editingReagent}
        onSubmitCreate={createReagent}
        onSubmitUpdate={updateReagent}
        onCheckCodeAvailability={checkCodeAvailability}
        activeLabCodigo={activeLab}
      />

      {/* Settings / User Profile Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Perfil y Configuración"
        description="Información de la sesión actual y contexto de laboratorio"
        footer={
          <Button
            variant="danger"
            onClick={handleSignOut}
            leftIcon={<LogOut className="h-4 w-4" />}
          >
            Cerrar Sesión
          </Button>
        }
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-sans font-bold text-sm text-on-surface">
                {profile?.nombre_completo || (isGuest ? 'Usuario Invitado' : 'Usuario')}
              </p>
              <p className="font-sans text-xs text-on-surface-variant">
                {user?.email || 'Sin correo asociado'}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between py-1.5 border-b border-outline-variant/30">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Rol:
              </span>
              <span className="font-bold uppercase text-primary">
                {profile?.rol || (isGuest ? 'invitado' : 'analista')}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-outline-variant/30">
              <span className="text-on-surface-variant">Laboratorio Activo:</span>
              <span className="font-bold text-on-surface">{activeLab}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
