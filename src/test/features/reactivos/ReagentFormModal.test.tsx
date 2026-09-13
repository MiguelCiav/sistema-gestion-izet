import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ReagentFormModal } from '../../../features/reactivos/components/ReagentFormModal'

describe('ReagentFormModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmitCreate: vi.fn().mockResolvedValue({ success: true, error: null }),
    onSubmitUpdate: vi.fn().mockResolvedValue({ success: true, error: null }),
    onCheckCodeAvailability: vi.fn().mockResolvedValue({ isAvailable: true }),
    activeLabCodigo: 'LEPA' as const,
  }

  it('renders form inputs for creation', () => {
    render(<ReagentFormModal {...defaultProps} />)
    expect(screen.getByText('Añadir Nuevo Reactivo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ej: RCT-HCL-01')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ej: Ácido Clorhídrico 37%')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ej: HCl')).toBeInTheDocument()
    expect(screen.getByText(/rombo de seguridad nfpa 704/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar reactivo/i })).toBeInTheDocument()
  })

  it('checks code availability in real-time when user types code (HU03 Criterio 2)', async () => {
    const mockCheck = vi.fn().mockResolvedValue({ isAvailable: true })
    render(<ReagentFormModal {...defaultProps} onCheckCodeAvailability={mockCheck} />)

    const codeInput = screen.getByPlaceholderText('Ej: RCT-HCL-01')
    fireEvent.change(codeInput, { target: { value: 'RCT-ACET-01' } })

    await waitFor(() => {
      expect(mockCheck).toHaveBeenCalledWith('RCT-ACET-01', undefined)
    })

    expect(await screen.findByText(/código disponible/i)).toBeInTheDocument()
  })

  it('shows duplicate error if code is already taken', async () => {
    const mockCheck = vi.fn().mockResolvedValue({ isAvailable: false })
    render(<ReagentFormModal {...defaultProps} onCheckCodeAvailability={mockCheck} />)

    const codeInput = screen.getByPlaceholderText('Ej: RCT-HCL-01')
    fireEvent.change(codeInput, { target: { value: 'RCT-HCL-01' } })

    expect(await screen.findByText(/este código ya está registrado en el catálogo/i)).toBeInTheDocument()
  })

  it('allows adding and removing regulatory entities', async () => {
    render(<ReagentFormModal {...defaultProps} />)

    // Check regulated checkbox
    const regulatedCheck = screen.getByLabelText(/sustancia regulada \/ fiscalizada/i)
    fireEvent.click(regulatedCheck)

    const entityInput = screen.getByPlaceholderText(/agregar entidad/i)
    fireEvent.change(entityInput, { target: { value: 'RESQUIMIC' } })

    const addBtn = screen.getByRole('button', { name: /añadir/i })
    fireEvent.click(addBtn)

    expect(await screen.findByText('RESQUIMIC')).toBeInTheDocument()

    // Remove entity
    const removeBtn = screen.getByLabelText('Eliminar RESQUIMIC')
    fireEvent.click(removeBtn)

    expect(screen.queryByText('RESQUIMIC')).not.toBeInTheDocument()
  })

  it('submits create form when required fields are populated', async () => {
    const submitCreate = vi.fn().mockResolvedValue({ success: true, error: null })
    render(<ReagentFormModal {...defaultProps} onSubmitCreate={submitCreate} />)

    fireEvent.change(screen.getByPlaceholderText('Ej: RCT-HCL-01'), {
      target: { value: 'RCT-NEW-01' },
    })
    fireEvent.change(screen.getByPlaceholderText('Ej: Ácido Clorhídrico 37%'), {
      target: { value: 'Sulfato de Sodio' },
    })
    fireEvent.change(screen.getByPlaceholderText('Ej: HCl'), {
      target: { value: 'Na2SO4' },
    })

    await waitFor(() => {
      expect(screen.queryByText(/código disponible/i)).toBeInTheDocument()
    })

    const submitBtn = screen.getByRole('button', { name: /registrar reactivo/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(submitCreate).toHaveBeenCalled()
    })
  })
})
