import React, { useState, useEffect } from 'react'
import { AlertTriangle, AlertCircle, LogOut, User, Shield, CheckCircle2 } from 'lucide-react'
import { TopBar } from '../../../components/ui/TopBar'
import { BottomNavigation, type NavTabId } from '../../../components/ui/BottomNavigation'
import { Card } from '../../../components/ui/Card'
import { FloatingActionButton } from '../../../components/ui/FloatingActionButton'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { useAuth } from '../../auth'
import { useLab } from '../../laboratorios'
import { reagentsService, type StockAlert } from '../../reactivos'

export interface DashboardViewProps {
  currentTab?: NavTabId
  onNavigate?: (tab: NavTabId) => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentTab = 'dashboard',
  onNavigate,
}) => {
  const { user, profile, isGuest, signOut } = useAuth()
  const { activeLab, activeLabId, switchLab, activeLabNombre } = useLab()

  const [activeTab, setActiveTab] = useState<NavTabId>(currentTab)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([])
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchAlerts = async () => {
      setIsLoadingAlerts(true)
      try {
        const alerts = await reagentsService.getStockAlerts(activeLabId)
        if (isMounted) {
          setStockAlerts(alerts)
        }
      } catch {
        if (isMounted) {
          setStockAlerts([])
        }
      } finally {
        if (isMounted) {
          setIsLoadingAlerts(false)
        }
      }
    }

    fetchAlerts()
    return () => {
      isMounted = false
    }
  }, [activeLabId])

  const handleSignOut = async () => {
    setIsSettingsOpen(false)
    await signOut()
  }

  const isAdmin = profile?.rol === 'admin'

  return (
    <div className="min-h-screen bg-surface-warm pb-24 text-on-surface">
      {/* Persistent TopBar with lab switcher */}
      <TopBar
        currentLab={activeLab}
        onSwitchLab={isAdmin || isGuest ? switchLab : undefined}
        onSettingsClick={() => setIsSettingsOpen(true)}
        userName={profile?.nombre_completo || user?.email || 'Usuario'}
      />

      <main className="max-w-md mx-auto px-5 pt-6 pb-12 space-y-8">
        {/* Lab banner info */}
        <div className="text-left">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-primary">
            Sede Activa: {activeLab}
          </span>
          <h2 className="text-xs text-on-surface-variant font-sans mt-0.5">
            {activeLabNombre}
          </h2>
        </div>

        {/* Section: Alertas de Reactivos */}
        <section className="space-y-4 text-left">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl font-bold text-on-surface shrink-0">
              Alertas de reactivos
            </h2>
            <div className="h-px bg-outline-variant/50 flex-1" />
          </div>

          <div className="space-y-3">
            {isLoadingAlerts ? (
              <div className="space-y-3">
                <div className="h-16 rounded-2xl bg-surface-container animate-pulse border border-outline-variant/20" />
                <div className="h-16 rounded-2xl bg-surface-container animate-pulse border border-outline-variant/20" />
              </div>
            ) : stockAlerts.length > 0 ? (
              stockAlerts.map((alert) => {
                const isEscasez = alert.tipo === 'ESCASEZ'
                return (
                  <Card
                    key={`${alert.tipo}-${alert.reactivoId}`}
                    variant={isEscasez ? 'alert-warning' : 'alert-danger'}
                    className="p-4 flex items-center justify-between cursor-pointer select-none transition-transform hover:-translate-y-0.5 active:translate-y-0"
                    onClick={() => onNavigate?.('inventario')}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <span className="font-sans font-bold text-sm sm:text-base text-on-surface block truncate">
                        {alert.mensaje}
                      </span>
                      <span className="text-xs font-sans text-on-surface-variant block mt-0.5 truncate">
                        {alert.nombre} — {alert.cantidadActual} {alert.unidadMedida} disponibles
                        {isEscasez && ` (umbral: ${alert.umbralMinimo} ${alert.unidadMedida})`}
                      </span>
                    </div>
                    {isEscasez ? (
                      <AlertTriangle className="h-5 w-5 text-[#705c30] shrink-0 stroke-[2.2]" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-error shrink-0 stroke-[2.2]" />
                    )}
                  </Card>
                )
              })
            ) : (
              <Card className="p-4 flex items-center gap-3 bg-surface-container/50 border border-outline-variant/30 text-on-surface-variant text-xs font-sans">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span>
                  No hay alertas de reactivos activas para el laboratorio {activeLab}. Todas las existencias superan sus umbrales.
                </span>
              </Card>
            )}
          </div>
        </section>

        {/* Section: Alertas de Equipos */}
        <section className="space-y-4 text-left">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl font-bold text-on-surface shrink-0">
              Alertas de equipos
            </h2>
            <div className="h-px bg-outline-variant/50 flex-1" />
          </div>

          <div className="space-y-3">
            <Card variant="alert-warning" className="p-4 flex items-center justify-between">
              <span className="font-sans font-bold text-sm sm:text-base text-on-surface">
                Equipo 7 tiene que limpiarse pronto
              </span>
              <AlertTriangle className="h-5 w-5 text-[#705c30] shrink-0 stroke-[2.2]" />
            </Card>

            <Card variant="alert-danger" className="p-4 flex items-center justify-between">
              <span className="font-sans font-bold text-sm sm:text-base text-on-surface">
                Equipo 18 tiene una calibración atrasada
              </span>
              <AlertCircle className="h-5 w-5 text-error shrink-0 stroke-[2.2]" />
            </Card>
          </div>
        </section>
      </main>

      {/* Floating Action Button (FAB) */}
      <FloatingActionButton
        label="Registrar consumo"
        onClick={() => {
          // Future slice: Open Quick Consume Modal
        }}
      />

      {/* Persistent Bottom Navigation */}
      <BottomNavigation
        activeTab={currentTab || activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          onNavigate?.(tab)
        }}
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
                {profile?.nombre_completo || 'Usuario del Laboratorio'}
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
                {profile?.rol || 'analista'}
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
