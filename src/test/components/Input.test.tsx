import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../../components/ui/Input'

describe('Input Component', () => {
  it('renders with label and helper text', () => {
    render(
      <Input
        label="Nombre del Reactivo"
        helperText="Ingrese la nomenclatura IUPAC"
        placeholder="Ej: Etanol"
      />
    )
    expect(screen.getByText('Nombre del Reactivo')).toBeInTheDocument()
    expect(screen.getByText('Ingrese la nomenclatura IUPAC')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ej: Etanol')).toBeInTheDocument()
  })

  it('renders error message and applies error styles', () => {
    render(<Input label="Código" error="El código es obligatorio" />)
    expect(screen.getByText('El código es obligatorio')).toBeInTheDocument()
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-error')
  })

  it('handles value change events', () => {
    const handleChange = vi.fn()
    render(<Input placeholder="Buscar" onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Buscar')
    fireEvent.change(input, { target: { value: 'Metanol' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('toggles password visibility when showPasswordToggle is enabled', () => {
    render(
      <Input
        type="password"
        label="Contraseña"
        showPasswordToggle
        data-testid="password-input"
      />
    )
    const input = screen.getByTestId('password-input')
    expect(input).toHaveAttribute('type', 'password')

    const toggleBtn = screen.getByLabelText('Ver contraseña')
    fireEvent.click(toggleBtn)

    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Ocultar contraseña')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Ocultar contraseña'))
    expect(input).toHaveAttribute('type', 'password')
  })
})
