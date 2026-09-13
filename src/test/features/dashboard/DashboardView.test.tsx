import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardView } from '../../../features/dashboard'
import { AuthProvider } from '../../../features/auth'
import { LabProvider } from '../../../features/laboratorios'

describe('DashboardView Component', () => {
  const renderDashboard = () => {
    return render(
      <AuthProvider>
        <LabProvider>
          <DashboardView />
        </LabProvider>
      </AuthProvider>
    )
  }

  it('renders lab header and sections matching DASHBOARD wireframe', () => {
    renderDashboard()
    expect(screen.getByText('Terra Lab')).toBeInTheDocument()
    expect(screen.getByText(/sede activa:/i)).toBeInTheDocument()
    expect(screen.getByText('Alertas de reactivos')).toBeInTheDocument()
    expect(screen.getByText('DCA03 escasea')).toBeInTheDocument()
    expect(screen.getByText('DCA03 sin existencia')).toBeInTheDocument()
    expect(screen.getByText('Alertas de equipos')).toBeInTheDocument()
    expect(screen.getByText('Equipo 7 tiene que limpiarse pronto')).toBeInTheDocument()
    expect(screen.getByText('Equipo 18 tiene una calibración atrasada')).toBeInTheDocument()
    expect(screen.getByText('Registrar consumo')).toBeInTheDocument()
  })

  it('opens and closes settings modal', () => {
    renderDashboard()
    const settingsBtn = screen.getByLabelText('Configuración')
    fireEvent.click(settingsBtn)

    expect(screen.getByText('Perfil y Configuración')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument()

    const closeBtn = screen.getByLabelText('Cerrar modal')
    fireEvent.click(closeBtn)
    expect(screen.queryByText('Perfil y Configuración')).not.toBeInTheDocument()
  })
})
