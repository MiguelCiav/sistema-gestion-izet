import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../../components/ui/Button'

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Guardar</Button>)
    const button = screen.getByRole('button', { name: /guardar/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Acción</Button>)
    const button = screen.getByRole('button', { name: /acción/i })
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders loading state and disables button', () => {
    const handleClick = vi.fn()
    render(
      <Button isLoading onClick={handleClick}>
        Cargando
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders different variants correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secundario</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary-container')

    rerender(<Button variant="outline">Borde</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-2')

    rerender(<Button variant="danger">Eliminar</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-error')

    rerender(<Button variant="ghost">Fantasma</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-on-surface-variant')
  })

  it('renders full width button when isFullWidth is true', () => {
    render(<Button isFullWidth>Ancho Completo</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })
})
