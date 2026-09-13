import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardView } from '../../../features/dashboard'
import { AuthProvider } from '../../../features/auth'
import { LabProvider } from '../../../features/laboratorios'
import { reagentsService } from '../../../features/reactivos'

vi.mock('../../../features/reactivos', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../features/reactivos')>()
  return {
    ...actual,
    reagentsService: {
      ...actual.reagentsService,
      getStockAlerts: vi.fn().mockResolvedValue([
        {
          reactivoId: 'seed-dca-01',
          codigoUnico: 'DCA03',
          nombre: 'Dicloroacetato 10%',
          tipo: 'ESCASEZ',
          mensaje: 'DCA03 en escasez',
          cantidadActual: 150,
          umbralMinimo: 300,
          unidadMedida: 'ml',
        },
        {
          reactivoId: 'seed-dca-02',
          codigoUnico: 'DCA04',
          nombre: 'Dicloroanilina 98%',
          tipo: 'ESCASEZ',
          mensaje: 'DCA04 en escasez',
          cantidadActual: 0,
          umbralMinimo: 300,
          unidadMedida: 'g',
        },
      ]),
    },
  }
})

describe('DashboardView Component', () => {
  const renderDashboard = (onNavigate = vi.fn()) => {
    return render(
      <AuthProvider>
        <LabProvider>
          <DashboardView onNavigate={onNavigate} />
        </LabProvider>
      </AuthProvider>
    )
  }

  it('renders lab header and sections matching DASHBOARD wireframe', async () => {
    renderDashboard()
    expect(screen.getByText('Terra Lab')).toBeInTheDocument()
    expect(screen.getByText(/sede activa:/i)).toBeInTheDocument()
    expect(screen.getByText('Alertas de reactivos')).toBeInTheDocument()
    expect(await screen.findByText('DCA03 en escasez')).toBeInTheDocument()
    expect(screen.getByText('DCA04 en escasez')).toBeInTheDocument()
    expect(screen.getByText('Alertas de equipos')).toBeInTheDocument()
    expect(screen.getByText('Equipo 7 tiene que limpiarse pronto')).toBeInTheDocument()
    expect(screen.getByText('Equipo 18 tiene una calibración atrasada')).toBeInTheDocument()
    expect(screen.getByText('Registrar consumo')).toBeInTheDocument()
  })

  it('navigates to inventory when clicking an alert card', async () => {
    const onNavigate = vi.fn()
    renderDashboard(onNavigate)
    const alertCard = await screen.findByText('DCA03 en escasez')
    fireEvent.click(alertCard)
    expect(onNavigate).toHaveBeenCalledWith('inventario')
  })

  it('opens and closes settings modal', async () => {
    renderDashboard()
    await screen.findByText('DCA03 en escasez')
    const settingsBtn = screen.getByLabelText('Configuración')
    fireEvent.click(settingsBtn)

    expect(screen.getByText('Perfil y Configuración')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument()

    const closeBtn = screen.getByLabelText('Cerrar modal')
    fireEvent.click(closeBtn)
    expect(screen.queryByText('Perfil y Configuración')).not.toBeInTheDocument()
  })

  it('displays empty state banner when there are no stock alerts', async () => {
    vi.mocked(reagentsService.getStockAlerts).mockResolvedValueOnce([])
    renderDashboard()
    expect(
      await screen.findByText(/no hay alertas de reactivos activas para el laboratorio/i)
    ).toBeInTheDocument()
  })
})
