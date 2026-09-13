import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui/Card'

describe('Card Component', () => {
  it('renders composite card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Reactivo Ácido Sulfúrico</CardTitle>
          <CardDescription>Fórmula: H2SO4</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Stock actual: 250ml</p>
        </CardContent>
        <CardFooter>
          <button>Ver detalle</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Reactivo Ácido Sulfúrico')).toBeInTheDocument()
    expect(screen.getByText('Fórmula: H2SO4')).toBeInTheDocument()
    expect(screen.getByText('Stock actual: 250ml')).toBeInTheDocument()
    expect(screen.getByText('Ver detalle')).toBeInTheDocument()
  })

  it('applies alert-warning styling', () => {
    const { container } = render(
      <Card variant="alert-warning">
        <p>Alerta de escasez</p>
      </Card>
    )
    expect(container.firstChild).toHaveClass('border-l-[#705c30]')
  })

  it('applies alert-danger styling', () => {
    const { container } = render(
      <Card variant="alert-danger">
        <p>Alerta de reactivo agotado</p>
      </Card>
    )
    expect(container.firstChild).toHaveClass('border-l-error')
  })

  it('applies accent-left styling', () => {
    const { container } = render(
      <Card variant="accent-left">
        <p>Tarjeta con borde verde</p>
      </Card>
    )
    expect(container.firstChild).toHaveClass('border-l-primary')
  })
})
