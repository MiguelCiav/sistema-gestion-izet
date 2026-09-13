import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NumberStepper } from '../../components/ui/NumberStepper'

describe('NumberStepper Component', () => {
  it('renders value and unit correctly', () => {
    render(<NumberStepper value={5} unit="ml" onChange={() => {}} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(5)
    expect(screen.getByText('ml')).toBeInTheDocument()
  })

  it('increments value on plus click', () => {
    const handleChange = vi.fn()
    render(<NumberStepper value={2} onChange={handleChange} />)
    const plusBtn = screen.getByLabelText('Aumentar cantidad')
    fireEvent.click(plusBtn)
    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it('decrements value on minus click', () => {
    const handleChange = vi.fn()
    render(<NumberStepper value={4} onChange={handleChange} />)
    const minusBtn = screen.getByLabelText('Disminuir cantidad')
    fireEvent.click(minusBtn)
    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it('respects min boundary and disables minus button', () => {
    const handleChange = vi.fn()
    render(<NumberStepper value={0} min={0} onChange={handleChange} />)
    const minusBtn = screen.getByLabelText('Disminuir cantidad')
    expect(minusBtn).toBeDisabled()
    fireEvent.click(minusBtn)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('respects max boundary and disables plus button', () => {
    const handleChange = vi.fn()
    render(<NumberStepper value={10} max={10} onChange={handleChange} />)
    const plusBtn = screen.getByLabelText('Aumentar cantidad')
    expect(plusBtn).toBeDisabled()
    fireEvent.click(plusBtn)
    expect(handleChange).not.toHaveBeenCalled()
  })
})
