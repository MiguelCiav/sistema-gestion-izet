import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OnboardingSetupView, AuthProvider } from '../../../features/auth'
import { LabProvider } from '../../../features/laboratorios'

describe('OnboardingSetupView Component', () => {
  const renderOnboarding = (onFinish = vi.fn()) => {
    return render(
      <AuthProvider>
        <LabProvider>
          <OnboardingSetupView onFinishOnboarding={onFinish} />
        </LabProvider>
      </AuthProvider>
    )
  }

  it('renders Step 1 with lab selection buttons', () => {
    renderOnboarding()
    expect(screen.getByText('¡Bienvenido!')).toBeInTheDocument()
    expect(
      screen.getByText(/escoge el laboratorio en el que será usada esta instancia/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'LEPA' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'LEM' })).toBeInTheDocument()
  })

  it('navigates to Step 2 when selecting a laboratory', () => {
    renderOnboarding()
    const lepaBtn = screen.getByRole('button', { name: 'LEPA' })
    fireEvent.click(lepaBtn)

    expect(screen.getByText('¿Cómo debemos recordarte?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Usuario (Nombre completo)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /volver/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument()
  })

  it('validates password mismatch on Step 2', async () => {
    renderOnboarding()
    fireEvent.click(screen.getByRole('button', { name: 'LEPA' }))

    fireEvent.change(screen.getByPlaceholderText('Usuario (Nombre completo)'), {
      target: { value: 'Admin IZT' },
    })
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'admin@izt.ciens.ucv.ve' },
    })
    fireEvent.change(screen.getByPlaceholderText('Clave'), {
      target: { value: '123456' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirma tu clave'), {
      target: { value: '654321' },
    })

    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument()
  })
})
