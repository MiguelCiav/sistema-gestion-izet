import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReagentCard } from '../../../features/reactivos/components/ReagentCard'
import type { ReagentItem } from '../../../features/reactivos/services/reagentsService'

const mockReagent: ReagentItem = {
  id: 'test-rct-01',
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
    laboratorio_id: 'lab-lepa',
    cantidad_actual: 1500,
    unidad_medida: 'ml',
    ubicacion_fisica: 'Gabinete de Ácidos 1',
    umbral_minimo: 500,
    fecha_vencimiento: '2027-12-31',
    lote: 'L-2026',
    estado_fisico: 'DISPONIBLE',
  },
}

describe('ReagentCard Component', () => {
  it('renders name, code, stock, and formula', () => {
    render(<ReagentCard reagent={mockReagent} />)
    expect(screen.getByText('Ácido Clorhídrico 37%')).toBeInTheDocument()
    expect(screen.getByText('RCT-HCL-01')).toBeInTheDocument()
    expect(screen.getByText(/1500\s*ml/i)).toBeInTheDocument()
    expect(screen.getByText('HCl')).toBeInTheDocument()
    expect(screen.getByText(/gabinete de ácidos 1/i)).toBeInTheDocument()
  })

  it('renders status badges for regulated and common use', () => {
    render(<ReagentCard reagent={mockReagent} />)
    expect(screen.getByText(/regulado/i)).toBeInTheDocument()
    expect(screen.getByText(/uso común/i)).toBeInTheDocument()
    expect(screen.getByText(/disponible/i)).toBeInTheDocument()
  })

  it('renders Escasez badge when stock is below or equal to threshold (HU07)', () => {
    const lowStockReagent: ReagentItem = {
      ...mockReagent,
      stock: {
        ...mockReagent.stock!,
        cantidad_actual: 400,
        umbral_minimo: 500,
      },
    }
    render(<ReagentCard reagent={lowStockReagent} />)
    expect(screen.getByText('En Escasez')).toBeInTheDocument()
  })

  it('renders En Escasez badge when stock is zero (HU07)', () => {
    const zeroStockReagent: ReagentItem = {
      ...mockReagent,
      stock: {
        ...mockReagent.stock!,
        cantidad_actual: 0,
        umbral_minimo: 500,
      },
    }
    render(<ReagentCard reagent={zeroStockReagent} />)
    expect(screen.getByText('En Escasez')).toBeInTheDocument()
  })

  it('triggers onClick when clicked or pressed Enter', () => {
    const handleClick = vi.fn()
    render(<ReagentCard reagent={mockReagent} onClick={handleClick} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)
    expect(handleClick).toHaveBeenCalledWith(mockReagent)

    fireEvent.keyDown(card, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('renders NFPA 704 Diamond with proper values', () => {
    render(<ReagentCard reagent={mockReagent} />)
    expect(screen.getByText('3')).toBeInTheDocument() // Salud
    expect(screen.getByText('1')).toBeInTheDocument() // Inestabilidad
  })
})
