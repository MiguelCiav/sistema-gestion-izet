import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InventoryView } from '../../../features/reactivos/views/InventoryView'
import { AuthProvider } from '../../../features/auth'
import { LabProvider } from '../../../features/laboratorios'
import type { ReagentItem } from '../../../features/reactivos/services/reagentsService'

const mockReagents: ReagentItem[] = [
  {
    id: 'seed-hcl-01',
    codigo_unico: 'RCT-HCL-01',
    nombre: 'Ácido Clorhídrico 37%',
    formula_quimica: 'HCl',
    clasificacion_riesgo: 'Corrosivo',
    nfpa_salud: 3,
    nfpa_inflamabilidad: 0,
    nfpa_inestabilidad: 1,
    nfpa_especial: null,
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
      id: 'stock-hcl-01',
      laboratorio_id: 'lepa-seed-id',
      cantidad_actual: 1500,
      unidad_medida: 'ml',
      ubicacion_fisica: 'Gabinete de Ácidos 1 - Estante A',
      umbral_minimo: 500,
      fecha_vencimiento: '2027-12-31',
      lote: 'L-HCL-2026-A',
      estado_fisico: 'DISPONIBLE',
    },
  },
  {
    id: 'seed-etoh-02',
    codigo_unico: 'RCT-ETOH-02',
    nombre: 'Etanol Absoluto 99.8%',
    formula_quimica: 'C2H5OH',
    clasificacion_riesgo: 'Inflamable',
    nfpa_salud: 2,
    nfpa_inflamabilidad: 3,
    nfpa_inestabilidad: 0,
    nfpa_especial: null,
    es_regulado: false,
    entidades_regulatorias: [],
    es_uso_comun: true,
    ultimo_precio: 28.5,
    moneda_precio: 'USD',
    fecha_ultimo_precio: '2026-08-20',
    activo: true,
    created_at: '2026-08-20T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
    stock: {
      id: 'stock-etoh-02',
      laboratorio_id: 'lepa-seed-id',
      cantidad_actual: 2500,
      unidad_medida: 'ml',
      ubicacion_fisica: 'Gabinete de Inflamables 2',
      umbral_minimo: 1000,
      fecha_vencimiento: '2028-06-30',
      lote: 'L-ETOH-2026-B',
      estado_fisico: 'DISPONIBLE',
    },
  },
  {
    id: 'seed-act-04',
    codigo_unico: 'RCT-ACT-04',
    nombre: 'Acetona Grado Analítico',
    formula_quimica: 'CH3COCH3',
    clasificacion_riesgo: 'Inflamable',
    nfpa_salud: 1,
    nfpa_inflamabilidad: 3,
    nfpa_inestabilidad: 0,
    nfpa_especial: null,
    es_regulado: true,
    entidades_regulatorias: ['RESQUIMIC'],
    es_uso_comun: true,
    ultimo_precio: 32.0,
    moneda_precio: 'USD',
    fecha_ultimo_precio: '2026-08-10',
    activo: true,
    created_at: '2026-08-10T10:00:00Z',
    updated_at: '2026-08-10T10:00:00Z',
    stock: {
      id: 'stock-act-04',
      laboratorio_id: 'lepa-seed-id',
      cantidad_actual: 500,
      unidad_medida: 'ml',
      ubicacion_fisica: 'Gabinete de Inflamables 1',
      umbral_minimo: 500,
      fecha_vencimiento: '2027-10-20',
      lote: 'L-ACT-2026-X',
      estado_fisico: 'DISPONIBLE',
    },
  },
]

vi.mock('../../../features/reactivos/services/reagentsService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../features/reactivos/services/reagentsService')>()
  return {
    ...actual,
    reagentsService: {
      ...actual.reagentsService,
      getReagents: vi.fn().mockImplementation(async (_labId, filters) => {
        return mockReagents.filter((r) => {
          if (filters?.soloRegulados && !r.es_regulado) return false
          if (filters?.soloUsoComun && !r.es_uso_comun) return false
          if (filters?.soloEscasez) {
            if (
              !r.stock ||
              r.stock.cantidad_actual <= 0 ||
              r.stock.cantidad_actual > r.stock.umbral_minimo
            ) {
              return false
            }
          }
          if (filters?.soloSinExistencia) {
            if (r.stock && r.stock.cantidad_actual > 0) {
              return false
            }
          }
          return true
        })
      }),
      getStockAlerts: vi.fn().mockImplementation(async () => [
        {
          reactivoId: 'seed-act-04',
          codigoUnico: 'RCT-ACT-04',
          nombre: 'Acetona Grado Analítico',
          tipo: 'ESCASEZ',
          mensaje: 'RCT-ACT-04 escasea',
          cantidadActual: 500,
          umbralMinimo: 500,
          unidadMedida: 'ml',
        },
      ]),
      upsertStock: vi.fn().mockResolvedValue({ success: true, error: null }),
    },
  }
})

describe('InventoryView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderView = (onNavigate = vi.fn()) => {
    return render(
      <AuthProvider>
        <LabProvider>
          <InventoryView onNavigate={onNavigate} />
        </LabProvider>
      </AuthProvider>
    )
  }

  it('renders header, active laboratory info, search bar, and FAB', async () => {
    renderView()
    expect(screen.getByRole('heading', { level: 1, name: 'Inventario' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/buscar por nombre, código o fórmula/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtros de búsqueda/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Botón Añadir Reactivo' })).toBeInTheDocument()
    await screen.findByText('Ácido Clorhídrico 37%')
  })

  it('renders bottom navigation tabs', async () => {
    renderView()
    expect(screen.getByRole('button', { name: 'Inventario' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bitácora' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Préstamos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    await screen.findByText('Ácido Clorhídrico 37%')
  })

  it('renders list of reagents from catalog', async () => {
    renderView()
    expect(await screen.findByText('Ácido Clorhídrico 37%')).toBeInTheDocument()
    expect(screen.getByText('RCT-HCL-01')).toBeInTheDocument()
    expect(screen.getByText('Etanol Absoluto 99.8%')).toBeInTheDocument()
  })

  it('filters reagent list when typing in search bar', async () => {
    renderView()
    await screen.findByText('Ácido Clorhídrico 37%')

    const searchInput = screen.getByPlaceholderText(/buscar por nombre, código o fórmula/i)
    fireEvent.change(searchInput, { target: { value: 'etanol' } })

    expect(screen.getByText('Etanol Absoluto 99.8%')).toBeInTheDocument()
    expect(screen.queryByText('Ácido Clorhídrico 37%')).not.toBeInTheDocument()
  })

  it('toggles filter chips when clicking the filter button', async () => {
    renderView()
    await screen.findByText('Ácido Clorhídrico 37%')
    const filterToggleBtn = screen.getByRole('button', { name: /filtros de búsqueda/i })
    fireEvent.click(filterToggleBtn)

    expect(screen.getByText('Filtros:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtro solo regulados/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtro solo uso común/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtro solo escasez/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtro solo sin existencias/i })).toBeInTheDocument()
  })

  it('renders active stock alerts banner when reagents are in scarcity', async () => {
    renderView()
    expect(await screen.findByText(/alerta.*de reactivos en LEPA/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtrar escasez/i })).toBeInTheDocument()
  })

  it('opens detail modal when clicking a reagent card', async () => {
    renderView()
    const hclCard = await screen.findByText('Ácido Clorhídrico 37%')
    fireEvent.click(hclCard)

    expect(await screen.findByText('Detalle del Reactivo')).toBeInTheDocument()
    expect(screen.getByText('Código Único')).toBeInTheDocument()
    expect(screen.getByText('Stock disponible (LEPA)')).toBeInTheDocument()
  })

  it('opens stock modal when clicking Gestionar Stock in detail modal', async () => {
    renderView()
    const hclCard = await screen.findByText('Ácido Clorhídrico 37%')
    fireEvent.click(hclCard)

    const manageStockBtn = await screen.findByRole('button', { name: /gestionar stock/i })
    fireEvent.click(manageStockBtn)

    expect(await screen.findByRole('heading', { name: /gestionar stock/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/cantidad física actual/i)).toBeInTheDocument()
  })

  it('opens create modal when clicking the FAB Añadir Reactivo', async () => {
    renderView()
    const fab = screen.getByRole('button', { name: 'Botón Añadir Reactivo' })
    fireEvent.click(fab)

    expect(await screen.findByText('Añadir Nuevo Reactivo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ej: RCT-HCL-01')).toBeInTheDocument()
  })
})
