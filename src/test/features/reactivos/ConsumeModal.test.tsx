import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConsumeModal } from '../../../features/reactivos/components/ConsumeModal'
import type { ReagentItem } from '../../../features/reactivos/services/reagentsService'

const mockReagents: ReagentItem[] = [
  {
    id: 'reagent-1',
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
    ultimo_precio: 45,
    moneda_precio: 'USD',
    fecha_ultimo_precio: '2026-01-01',
    activo: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    stock: {
      id: 'stock-1',
      laboratorio_id: 'lab-lepa',
      cantidad_actual: 500,
      unidad_medida: 'ml',
      ubicacion_fisica: 'Estante 1',
      umbral_minimo: 100,
      fecha_vencimiento: '2028-01-01',
      lote: 'L-01',
      ultimo_precio_adquirido: 45,
      moneda_precio: 'USD',
      es_uso_comun: true,
      estado_fisico: 'DISPONIBLE',
    },
  },
  {
    id: 'reagent-2',
    codigo_unico: 'RCT-NAOH-03',
    nombre: 'Hidróxido de Sodio',
    formula_quimica: 'NaOH',
    clasificacion_riesgo: 'Corrosivo',
    nfpa_salud: 3,
    nfpa_inflamabilidad: 0,
    nfpa_inestabilidad: 1,
    nfpa_especial: null,
    es_regulado: false,
    entidades_regulatorias: [],
    es_uso_comun: false,
    ultimo_precio: 20,
    moneda_precio: 'USD',
    fecha_ultimo_precio: '2026-01-01',
    activo: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    stock: {
      id: 'stock-2',
      laboratorio_id: 'lab-lepa',
      cantidad_actual: 0, // Agotado, no debería ser seleccionable
      unidad_medida: 'g',
      ubicacion_fisica: 'Estante 2',
      umbral_minimo: 100,
      fecha_vencimiento: '2028-01-01',
      lote: 'L-02',
      ultimo_precio_adquirido: 20,
      moneda_precio: 'USD',
      es_uso_comun: false,
      estado_fisico: 'AGOTADO',
    },
  },
]

describe('ConsumeModal Component (HU05)', () => {
  it('renders reagent picker when no reagent is pre-selected', () => {
    render(
      <ConsumeModal
        isOpen={true}
        onClose={vi.fn()}
        reagent={null}
        availableReagents={mockReagents}
        activeLabId="lab-lepa"
        activeLabCodigo="LEPA"
        onConfirmConsume={vi.fn()}
      />
    )

    expect(screen.getByText('¿Qué reactivo consumiste?')).toBeInTheDocument()
    expect(screen.getByText('Ácido Clorhídrico 37%')).toBeInTheDocument()
    // Reagent with 0 stock should not be listed as pickable
    expect(screen.queryByText('Hidróxido de Sodio')).not.toBeInTheDocument()
  })

  it('renders consumption details when reagent is provided', () => {
    render(
      <ConsumeModal
        isOpen={true}
        onClose={vi.fn()}
        reagent={mockReagents[0]!}
        availableReagents={mockReagents}
        activeLabId="lab-lepa"
        activeLabCodigo="LEPA"
        defaultUserName="Lic. Juan Pérez"
        onConfirmConsume={vi.fn()}
      />
    )

    expect(screen.getByText('¿Cuánto consumiste?')).toBeInTheDocument()
    expect(screen.getByText('Ácido Clorhídrico 37%')).toBeInTheDocument()
    expect(screen.getByText(/Cod: RCT-HCL-01 \/ Stock: 500 ml/)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Lic. Juan Pérez')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
  })

  it('successfully submits consumption when confirming valid amount', async () => {
    const onConfirmConsume = vi.fn().mockResolvedValue({
      success: true,
      error: null,
      data: {
        stock_posterior: 480,
      },
    })
    const onClose = vi.fn()

    render(
      <ConsumeModal
        isOpen={true}
        onClose={onClose}
        reagent={mockReagents[0]!}
        availableReagents={mockReagents}
        activeLabId="lab-lepa"
        activeLabCodigo="LEPA"
        onConfirmConsume={onConfirmConsume}
      />
    )

    // Type motivo
    const motivoInput = screen.getByLabelText(/proyecto, asignatura o motivo/i)
    fireEvent.change(motivoInput, { target: { value: 'Práctica de laboratorio general' } })

    // Click Confirmar
    const confirmBtn = screen.getByRole('button', { name: /confirmar/i })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(onConfirmConsume).toHaveBeenCalledWith({
        reactivo_id: 'reagent-1',
        laboratorio_id: 'lab-lepa',
        cantidad: 1,
        motivo: 'Práctica de laboratorio general',
        nombre_responsable: undefined,
      })
    })

    expect(await screen.findByText(/Se registró el consumo de 1 ml/i)).toBeInTheDocument()
  })

  it('displays error if consumption fails', async () => {
    const onConfirmConsume = vi.fn().mockResolvedValue({
      success: false,
      error: 'Stock insuficiente para la operación',
    })

    render(
      <ConsumeModal
        isOpen={true}
        onClose={vi.fn()}
        reagent={mockReagents[0]!}
        availableReagents={mockReagents}
        activeLabId="lab-lepa"
        activeLabCodigo="LEPA"
        onConfirmConsume={onConfirmConsume}
      />
    )

    const confirmBtn = screen.getByRole('button', { name: /confirmar/i })
    fireEvent.click(confirmBtn)

    expect(await screen.findByText('Stock insuficiente para la operación')).toBeInTheDocument()
  })
})
