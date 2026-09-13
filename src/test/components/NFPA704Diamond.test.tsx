import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NFPA704Diamond } from '../../components/ui/NFPA704Diamond'

describe('NFPA704Diamond Component', () => {
  it('renders all four quadrants with values', () => {
    render(
      <NFPA704Diamond
        salud={2}
        inflamabilidad={3}
        inestabilidad={1}
        especial="OX"
      />
    )
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute(
      'aria-label',
      'NFPA 704: Salud: 2, Inflamabilidad: 3, Inestabilidad: 1, Especial: OX'
    )
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('OX')).toBeInTheDocument()
  })

  it('clamps values within 0-4 range', () => {
    render(
      <NFPA704Diamond
        salud={99}
        inflamabilidad={-5}
        inestabilidad={3}
      />
    )
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute(
      'aria-label',
      'NFPA 704: Salud: 4, Inflamabilidad: 0, Inestabilidad: 3'
    )
  })

  it('renders special water reactivity strikethrough symbol W', () => {
    render(
      <NFPA704Diamond
        salud={1}
        inflamabilidad={0}
        inestabilidad={2}
        especial="W"
      />
    )
    expect(screen.getByText('W')).toBeInTheDocument()
  })
})
