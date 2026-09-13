import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '../../components/ui/Select'

describe('Select Component', () => {
  const options = [
    { value: 'LEPA', label: 'Laboratorio LEPA' },
    { value: 'LEM', label: 'Laboratorio LEM' },
  ]

  it('renders label, placeholder and options', () => {
    render(
      <Select
        label="Seleccione Sede"
        placeholder="Seleccione un laboratorio"
        options={options}
      />
    )
    expect(screen.getByText('Seleccione Sede')).toBeInTheDocument()
    expect(screen.getByText('Seleccione un laboratorio')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Laboratorio LEPA')).toBeInTheDocument()
  })

  it('handles value change', () => {
    const handleChange = vi.fn()
    render(<Select options={options} onChange={handleChange} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'LEM' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders error message and applies error styles', () => {
    render(<Select options={options} error="Debe seleccionar una sede" />)
    expect(screen.getByText('Debe seleccionar una sede')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveClass('border-error')
  })
})
