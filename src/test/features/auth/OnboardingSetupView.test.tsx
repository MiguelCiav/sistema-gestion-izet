import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OnboardingSetupView, AuthProvider } from '../../../features/auth'
import { LabProvider } from '../../../features/laboratorios'
import { supabase } from '../../../lib/supabase'

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
      screen.getByText(/selecciona el laboratorio al que perteneces para continuar con tu registro/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'LEPA' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'LEM' })).toBeInTheDocument()
  })

  it('navigates to Step 2 when selecting a laboratory', () => {
    renderOnboarding()
    const lepaBtn = screen.getByRole('button', { name: 'LEPA' })
    fireEvent.click(lepaBtn)

    expect(screen.getByText('Crear Cuenta de Usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirma tu contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /volver/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument()
  })

  it('validates password mismatch on Step 2', async () => {
    renderOnboarding()
    fireEvent.click(screen.getByRole('button', { name: 'LEPA' }))

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), {
      target: { value: 'Usuario IZT' },
    })
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'usuario@izt.ciens.ucv.ve' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: '123456' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), {
      target: { value: '654321' },
    })

    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument()
  })

  it('progresses to Step 3 upon successful registration and shows email instructions', async () => {
    const onFinish = vi.fn()
    vi.spyOn(supabase.auth, 'signUp').mockResolvedValueOnce({
      data: { user: null, session: null },
      error: null,
    })

    renderOnboarding(onFinish)
    fireEvent.click(screen.getByRole('button', { name: 'LEPA' }))

    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), {
      target: { value: 'Investigador LEPA' },
    })
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'investigador@izt.ciens.ucv.ve' },
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'secreto123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), {
      target: { value: 'secreto123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

    expect(await screen.findByText('¡Registro Exitoso!')).toBeInTheDocument()
    expect(screen.getByText('investigador@izt.ciens.ucv.ve')).toBeInTheDocument()
    expect(screen.getByText(/abre el enlace en tu correo para activar tu cuenta/i)).toBeInTheDocument()

    const finishBtn = screen.getByRole('button', { name: /ir a iniciar sesión/i })
    fireEvent.click(finishBtn)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })
})
