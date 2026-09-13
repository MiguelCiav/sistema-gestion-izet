import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginView, AuthProvider } from '../../../features/auth'
import { LabProvider } from '../../../features/laboratorios'

describe('LoginView Component', () => {
  const renderLoginView = (onGoToOnboarding = vi.fn()) => {
    return render(
      <AuthProvider>
        <LabProvider>
          <LoginView onGoToOnboarding={onGoToOnboarding} />
        </LabProvider>
      </AuthProvider>
    )
  }

  it('renders login form elements and welcome header', () => {
    renderLoginView()
    expect(screen.getByText('¡Bienvenido!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ingrese su usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ingrese su contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ingresar como invitado/i })).toBeInTheDocument()
  })

  it('shows error message when submitted with empty fields', async () => {
    renderLoginView()
    const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitBtn)
    expect(
      await screen.findByText('Por favor ingrese su usuario/correo y contraseña')
    ).toBeInTheDocument()
  })

  it('navigates to onboarding when Registrarse is clicked', () => {
    const handleGoToOnboarding = vi.fn()
    renderLoginView(handleGoToOnboarding)
    const registerBtn = screen.getByRole('button', { name: /registrarse/i })
    fireEvent.click(registerBtn)
    expect(handleGoToOnboarding).toHaveBeenCalledTimes(1)
  })
})
