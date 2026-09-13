import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FloatingActionButton } from '../../components/ui/FloatingActionButton'

describe('FloatingActionButton Component', () => {
  it('renders fab button and responds to clicks', () => {
    const handleClick = vi.fn()
    render(<FloatingActionButton onClick={handleClick} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders label pill when label prop is passed', () => {
    const handleAction = vi.fn()
    render(<FloatingActionButton label="Registrar consumo" onClick={handleAction} />)
    expect(screen.getByText('Registrar consumo')).toBeInTheDocument()
    const labelBtn = screen.getByRole('button', { name: 'Registrar consumo' })
    fireEvent.click(labelBtn)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })
})
