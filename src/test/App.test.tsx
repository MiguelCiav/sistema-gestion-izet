import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App Component', () => {
  it('renders login screen by default when not authenticated', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('¡Bienvenido!')).toBeInTheDocument()
    })
    expect(screen.getByPlaceholderText('Ingrese su usuario')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
  })

  it('navigates from login to onboarding and back', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
    })

    const registerBtn = screen.getByRole('button', { name: /registrarse/i })
    fireEvent.click(registerBtn)

    expect(
      screen.getByText(/escoge el laboratorio en el que será usada esta instancia/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'LEPA' })).toBeInTheDocument()
  })

  it('allows entering as guest and displays Dashboard', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ingresar como invitado/i })).toBeInTheDocument()
    })

    const guestBtn = screen.getByRole('button', { name: /ingresar como invitado/i })
    fireEvent.click(guestBtn)

    expect(await screen.findByText('Terra Lab')).toBeInTheDocument()
    expect(screen.getByText('Alertas de reactivos')).toBeInTheDocument()
  })
})
