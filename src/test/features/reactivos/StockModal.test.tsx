import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StockModal } from '../../../features/reactivos/components/StockModal'
import type { ReagentItem } from '../../../features/reactivos/services/reagentsService'

const mockReagentWithStock: ReagentItem = {
  id: 'rct-01',
  codigo_unico: 'RCT-HCL-01',
  nombre: 'Ácido Clorhídrico 37%',
  formula_quimica: 'HCl',
  clasificacion_riesgo: 'Corrosivo',
  nfpa_salud: 3,
  nfpa_inflamabilidad: 0,
  nfpa_inestabilidad: 1,
  nfpa_especial: null,
  es_regulado: true,
  entidades_regulatorias: ['RESQUIMIC'],
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
    lote: 'L-HCL-2026-A',
    ultimo_precio_adquirido: 45.0,
    moneda_precio: 'USD',
    es_uso_comun: true,
    estado_fisico: 'DISPONIBLE',
  },
}

describe('StockModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    reagent: mockReagentWithStock,
    activeLabCodigo: 'LEPA' as const,
    activeLabId: 'lepa-id',
    onSubmitStock: vi.fn().mockResolvedValue({ success: true, error: null }),
  }

  it('renders all stock inputs with existing values (HU04)', () => {
    render(<StockModal {...defaultProps} />)
    expect(screen.getByText(/gestionar stock — rct-hcl-01/i)).toBeInTheDocument()
    expect(screen.getByText('Ácido Clorhídrico 37%')).toBeInTheDocument()
    expect(screen.getByText('Uso Común')).toBeInTheDocument()

    expect(screen.getByLabelText(/cantidad física actual/i)).toHaveValue(1500)
    expect(screen.getByLabelText(/umbral mínimo de alerta/i)).toHaveValue(500)
    expect(screen.getByLabelText(/ubicación física detallada/i)).toHaveValue('Gabinete de Ácidos 1')
    expect(screen.getByLabelText(/número de lote/i)).toHaveValue('L-HCL-2026-A')
    expect(screen.getByLabelText(/fecha de vencimiento/i)).toHaveValue('2027-12-31')
  })

  it('projects stock status condition in real-time as user types (HU07)', () => {
    render(<StockModal {...defaultProps} />)

    // Initially 1500 > 500 -> Stock Óptimo
    expect(screen.getByText(/stock óptimo \(disponible\)/i)).toBeInTheDocument()

    // Change to low stock (200 <= 500) -> Escasez
    const cantidadInput = screen.getByLabelText(/cantidad física actual/i)
    fireEvent.change(cantidadInput, { target: { value: '200' } })
    expect(screen.getByText(/escasez \(bajo umbral\)/i)).toBeInTheDocument()

    // Change to zero stock (0) -> Sin existencias
    fireEvent.change(cantidadInput, { target: { value: '0' } })
    expect(screen.getByText(/sin existencias \(0\)/i)).toBeInTheDocument()
  })

  it('validates mandatory location before submission', async () => {
    const onSubmit = vi.fn()
    render(<StockModal {...defaultProps} onSubmitStock={onSubmit} />)

    const ubicacionInput = screen.getByLabelText(/ubicación física detallada/i)
    fireEvent.change(ubicacionInput, { target: { value: '' } })

    const saveBtn = screen.getByRole('button', { name: /guardar stock físico/i })
    fireEvent.click(saveBtn)

    expect(await screen.findByText(/la ubicación física detallada es obligatoria/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits updated stock data properly', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ success: true, error: null })
    render(<StockModal {...defaultProps} onSubmitStock={onSubmit} />)

    const cantidadInput = screen.getByLabelText(/cantidad física actual/i)
    fireEvent.change(cantidadInput, { target: { value: '800' } })

    const saveBtn = screen.getByRole('button', { name: /guardar stock físico/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        reactivo_id: 'rct-01',
        laboratorio_id: 'lepa-id',
        cantidad_actual: 800,
        unidad_medida: 'ml',
        ubicacion_fisica: 'Gabinete de Ácidos 1',
        umbral_minimo: 500,
        fecha_vencimiento: '2027-12-31',
        lote: 'L-HCL-2026-A',
        ultimo_precio_adquirido: 45.0,
        moneda_precio: 'USD',
      })
    })
  })
})
