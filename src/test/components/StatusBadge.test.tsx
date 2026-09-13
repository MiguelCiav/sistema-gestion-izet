import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../../components/ui/StatusBadge'

describe('StatusBadge Component', () => {
  it('renders default label for regulado', () => {
    render(<StatusBadge variant="regulado" />)
    expect(screen.getByText('Regulado')).toBeInTheDocument()
  })

  it('renders default label for critico', () => {
    render(<StatusBadge variant="critico" />)
    expect(screen.getByText('Sin Existencia')).toBeInTheDocument()
  })

  it('renders default label for alerta', () => {
    render(<StatusBadge variant="alerta" />)
    expect(screen.getByText('Stock Bajo')).toBeInTheDocument()
  })

  it('renders custom label and custom icon when provided', () => {
    render(
      <StatusBadge
        variant="disponible"
        label="En Almacén Central"
        icon={<span data-testid="custom-icon">★</span>}
      />
    )
    expect(screen.getByText('En Almacén Central')).toBeInTheDocument()
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })
})
