import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressStepper } from '../../components/ui/ProgressStepper'

describe('ProgressStepper Component', () => {
  const steps = [
    { id: 'lab', label: 'Laboratorio' },
    { id: 'datos', label: 'Datos' },
    { id: 'confirmacion', label: 'Confirmación' },
  ]

  it('renders all step labels', () => {
    render(<ProgressStepper steps={steps} currentStep={1} />)
    expect(screen.getByText('Laboratorio')).toBeInTheDocument()
    expect(screen.getByText('Datos')).toBeInTheDocument()
    expect(screen.getByText('Confirmación')).toBeInTheDocument()
  })

  it('marks current step with aria-current="step"', () => {
    render(<ProgressStepper steps={steps} currentStep={1} />)
    const currentStepNode = screen.getByText('2').closest('div')
    expect(currentStepNode).toHaveAttribute('aria-current', 'step')
  })
})
