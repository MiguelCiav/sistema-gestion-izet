import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  SlidersHorizontal,
  RefreshCw,
  ClipboardList,
  LogOut,
  User,
  Shield,
} from 'lucide-react'
import { TopBar } from '../../../components/ui/TopBar'
import { BottomNavigation, type NavTabId } from '../../../components/ui/BottomNavigation'
import { SearchBar } from '../../../components/ui/SearchBar'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { BitacoraCard } from '../components/BitacoraCard'
import { BitacoraDetailModal } from '../components/BitacoraDetailModal'
import {
  bitacoraService,
  type BitacoraEntry,
  type TipoMovimientoFiltro,
} from '../services/bitacoraService'
import { useLab } from '../../laboratorios'
import { useAuth } from '../../auth'

export interface BitacoraViewProps {
  onNavigate?: (tab: NavTabId) => void
  currentTab?: NavTabId
}

export const BitacoraView: React.FC<BitacoraViewProps> = ({
  onNavigate,
  currentTab = 'bitacora',
}) => {
  const { activeLab, activeLabId, switchLab, activeLabNombre } = useLab()
  const { user, profile, signOut, isGuest } = useAuth()

  const [movimientos, setMovimientos] = useState<BitacoraEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState<TipoMovimientoFiltro>('TODOS')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<BitacoraEntry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const loadMovimientos = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await bitacoraService.getMovimientos(activeLabId, {
        tipoMovimiento: tipoFiltro,
        searchQuery,
      })
      setMovimientos(data)
    } finally {
      setIsLoading(false)
    }
  }, [activeLabId, tipoFiltro, searchQuery])

  useEffect(() => {
    loadMovimientos()
  }, [loadMovimientos])

  const handleSignOut = async () => {
    setIsSettingsOpen(false)
    await signOut()
  }

  // Agrupar movimientos cronológicamente por fecha (ej. "13 de Septiembre de 2026")
  const groupedMovements = useMemo(() => {
    const groups: { [dateStr: string]: BitacoraEntry[] } = {}

    movimientos.forEach((entry) => {
      const date = new Date(entry.created_at)
      const dateKey = date.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(entry)
    })

    return groups
  }, [movimientos])

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
        {/* Title Header Matching Wireframe BITÁCORA.png */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Bitácora
            </h1>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Movimientos en{' '}
              <span className="font-bold text-primary">{activeLab}</span> — {activeLabNombre}
            </p>
          </div>

          <button
            type="button"
            onClick={loadMovimientos}
            className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
            title="Recargar bitácora"
            aria-label="Recargar bitácora"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>

        {/* Search Bar & Filter Toggle Row (Matching Wireframe) */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por reactivo, código o responsable..."
              className="w-full"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            aria-label="Filtros de bitácora"
            className={`flex items-center justify-center h-11 w-11 rounded-xl border transition-all duration-150 ${
              showFilters || tipoFiltro !== 'TODOS'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/50 hover:bg-surface-container'
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Chips Row */}
        {showFilters && (
          <div className="mb-4 p-3 rounded-xl bg-surface-container/60 border border-outline-variant/30 flex flex-wrap gap-2 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-on-surface-variant self-center mr-1">
              Tipo:
            </span>

            {(['TODOS', 'CONSUMO', 'INGRESO', 'AJUSTE', 'PRESTAMO'] as TipoMovimientoFiltro[]).map(
              (tipo) => {
                const isSelected = tipoFiltro === tipo
                const label =
                  tipo === 'TODOS'
                    ? 'Todos'
                    : tipo === 'CONSUMO'
                    ? 'Consumos'
                    : tipo === 'INGRESO'
                    ? 'Ingresos'
                    : tipo === 'AJUSTE'
                    ? 'Ajustes'
                    : 'Préstamos'

                return (
                  <button
                    key={tipo}
                    type="button"
                    aria-label={`Filtrar por ${label}`}
                    onClick={() => setTipoFiltro(tipo)}
                    className="transition-transform active:scale-95"
                  >
                    <StatusBadge
                      variant={isSelected ? 'comun' : 'neutral'}
                      label={isSelected ? `✓ ${label}` : label}
                      className="cursor-pointer text-xs"
                    />
                  </button>
                )
              }
            )}
          </div>
        )}

        {/* Chronological List Grouped by Date (Matching Wireframe BITÁCORA.png) */}
        {isLoading && movimientos.length === 0 ? (
          <div className="py-12 text-center text-sm font-sans text-secondary flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            Cargando historial de movimientos...
          </div>
        ) : Object.keys(groupedMovements).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedMovements).map(([dateLabel, entries]) => (
              <div key={dateLabel} className="space-y-3">
                {/* Date Header with Line Divider */}
                <div className="flex items-center gap-3 pt-2">
                  <h3 className="font-display text-base sm:text-lg font-bold text-primary shrink-0">
                    {dateLabel}
                  </h3>
                  <div className="h-[1px] flex-1 bg-outline-variant/40" />
                </div>

                {/* Cards for this date */}
                <div className="space-y-2.5">
                  {entries.map((entry) => (
                    <BitacoraCard
                      key={entry.id}
                      entry={entry}
                      onClick={(e) => {
                        setSelectedEntry(e)
                        setIsDetailOpen(true)
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}

            <p className="text-center text-xs font-sans text-on-surface-variant/70 pt-4 pb-2">
              Mostrando {movimientos.length} movimiento(s) registrado(s) en bitácora
            </p>
          </div>
        ) : (
          /* Empty State */
          <div className="py-14 px-4 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-4">
              <ClipboardList className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-lg font-bold text-on-surface mb-1">
              No hay movimientos registrados
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-xs mb-4">
              {searchQuery || tipoFiltro !== 'TODOS'
                ? 'No se encontraron registros de bitácora para los filtros seleccionados.'
                : `Aún no se han registrado consumos, ingresos o préstamos en ${activeLab}.`}
            </p>
            {(searchQuery || tipoFiltro !== 'TODOS') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setTipoFiltro('TODOS')
                }}
                className="text-xs font-sans font-bold text-primary hover:underline"
              >
                Limpiar búsqueda y filtros
              </button>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={currentTab}
        onTabChange={(tab) => onNavigate?.(tab)}
      />

      {/* Bitácora Entry Detail Modal */}
      <BitacoraDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedEntry(null)
        }}
        entry={selectedEntry}
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
