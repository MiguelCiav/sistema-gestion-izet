import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReagentDetailModal } from '../../../features/reactivos/components/ReagentDetailModal'
import type { ReagentItem } from '../../../features/reactivos/services/reagentsService'

const mockReagent: ReagentItem = {
  id: 'test-detail-01',
  codigo_unico: 'RCT-HCL-01',
  nombre: 'Ácido Clorhídrico 37%',
  formula_quimica: 'HCl',
  clasificacion_riesgo: 'Corrosivo',
  nfpa_salud: 3,
  nfpa_inflamabilidad: 0,
  nfpa_inestabilidad: 1,
  nfpa_especial: 'W',
  es_regulado: true,
  entidades_regulatorias: ['RESQUIMIC', 'CICPC'],
  es_uso_comun: true,
  ultimo_precio: 45.0,
  moneda_precio: 'USD',
  fecha_ultimo_precio: '2026-08-15',
  activo: true,
  created_at: '2026-08-15T10:00:00Z',
  updated_at: '2026-08-15T10:00:00Z',
  stock: {
    id: 'stock-01',
    laboratorio_id: 'lepa-id',
    cantidad_actual: 1500,
    unidad_medida: 'ml',
    ubicacion_fisica: 'Gabinete de Ácidos 1',
    umbral_minimo: 500,
    fecha_vencimiento: '2027-12-31',
    lote: 'L-2026',
    estado_fisico: 'DISPONIBLE',
  },
}

describe('ReagentDetailModal Component', () => {
  it('does not render when isOpen is false or reagent is null', () => {
    const { container } = render(
      <ReagentDetailModal isOpen={false} onClose={vi.fn()} reagent={mockReagent} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders reagent details, NFPA diamond, and wireframe fields', () => {
    render(
      <ReagentDetailModal isOpen={true} onClose={vi.fn()} reagent={mockReagent} activeLabCodigo="LEPA" />
    )

    expect(screen.getByText('Detalle del Reactivo')).toBeInTheDocument()
    expect(screen.getByText('Ácido Clorhídrico 37%')).toBeInTheDocument()
    expect(screen.getByText('HCl')).toBeInTheDocument()
    expect(screen.getByText('RCT-HCL-01')).toBeInTheDocument()
    expect(screen.getByText('1500 ml')).toBeInTheDocument()
    expect(screen.getByText('500 ml')).toBeInTheDocument()
    expect(screen.getByText('Gabinete de Ácidos 1')).toBeInTheDocument()
    expect(screen.getByText('$45.00 USD')).toBeInTheDocument()

    // Regulated entities
    expect(screen.getByText('RESQUIMIC')).toBeInTheDocument()
    expect(screen.getByText('CICPC')).toBeInTheDocument()
  })

  it('triggers onEdit when Editar Reactivo is clicked', () => {
    const handleEdit = vi.fn()
    const handleClose = vi.fn()

    render(
      <ReagentDetailModal
        isOpen={true}
        onClose={handleClose}
        reagent={mockReagent}
        onEdit={handleEdit}
      />
    )

    const editBtn = screen.getByRole('button', { name: /editar reactivo/i })
    fireEvent.click(editBtn)
    expect(handleEdit).toHaveBeenCalledWith(mockReagent)
    expect(handleClose).toHaveBeenCalled()
  })

  it('shows confirmation when clicking Dar de Baja and calls onDeactivate', async () => {
    const handleDeactivate = vi.fn().mockResolvedValue(true)

    render(
      <ReagentDetailModal
        isOpen={true}
        onClose={vi.fn()}
        reagent={mockReagent}
        onDeactivate={handleDeactivate}
      />
    )

    const deactivateBtn = screen.getByRole('button', { name: /dar de baja/i })
    fireEvent.click(deactivateBtn)

    expect(
      screen.getByText(/¿estás seguro de que deseas dar de baja este reactivo\?/i)
    ).toBeInTheDocument()

    const confirmBtn = screen.getByRole('button', { name: /confirmar baja/i })
    fireEvent.click(confirmBtn)
    expect(handleDeactivate).toHaveBeenCalledWith(mockReagent.id)
  })
})
