import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  reagentsService,
  getReagentStockStatus,
  type CreateReagentInput,
  type ReagentItem,
} from '../../../features/reactivos/services/reagentsService'

describe('reagentsService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches reagents with fallback support when offline', async () => {
    const reagents = await reagentsService.getReagents('lepa-test-id')
    expect(reagents).toBeDefined()
    expect(Array.isArray(reagents)).toBe(true)
    expect(reagents.length).toBeGreaterThan(0)
    expect(reagents[0]).toHaveProperty('codigo_unico')
    expect(reagents[0]).toHaveProperty('nombre')
  })

  it('filters reagents by soloRegulados and soloUsoComun', async () => {
    const regulados = await reagentsService.getReagents(null, { soloRegulados: true })
    expect(regulados.every((r) => r.es_regulado)).toBe(true)

    const usoComun = await reagentsService.getReagents(null, { soloUsoComun: true })
    expect(usoComun.every((r) => r.es_uso_comun)).toBe(true)
  })

  it('validates code availability in real-time (HU03 Criterio 2)', async () => {
    // Existing code in seed
    const resExisting = await reagentsService.checkCodeAvailability('RCT-HCL-01')
    expect(resExisting.isAvailable).toBe(false)

    // Unused new code
    const resAvailable = await reagentsService.checkCodeAvailability('RCT-NEW-99')
    expect(resAvailable.isAvailable).toBe(true)

    // Empty code is not available
    const resEmpty = await reagentsService.checkCodeAvailability('   ')
    expect(resEmpty.isAvailable).toBe(false)
  })

  it('prevents creating a reagent with duplicate code (HU03 Criterio 1)', async () => {
    const duplicateInput: CreateReagentInput = {
      codigo_unico: 'RCT-HCL-01',
      nombre: 'Ácido Clorhídrico Duplicado',
      formula_quimica: 'HCl',
      clasificacion_riesgo: 'Corrosivo',
      nfpa_salud: 3,
      nfpa_inflamabilidad: 0,
      nfpa_inestabilidad: 1,
      es_regulado: true,
      es_uso_comun: true,
    }

    const result = await reagentsService.createReagent(duplicateInput)
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
    expect(result.error?.message).toContain('ya está registrado')
  })

  it('returns error when trying to delete reagent with active stock (HU02 Criterio 7)', async () => {
    // Attempting to delete a seeded reagent that has stock in LEPA/LEM
    const result = await reagentsService.deleteReagent('seed-hcl-01')
    // Should fail referential integrity check
    expect(result.error).toBeDefined()
  })

  it('deactivates a reagent through soft delete (HU02 Criterio 1)', async () => {
    const result = await reagentsService.deactivateReagent('seed-hcl-01')
    expect(result).toBeDefined()
  })

  it('correctly evaluates stock status according to HU07 criteria', () => {
    const makeMockReagent = (id: string, codigo: string, stock: ReagentItem['stock']): ReagentItem => ({
      id,
      codigo_unico: codigo,
      nombre: `Test ${codigo}`,
      formula_quimica: null,
      clasificacion_riesgo: 'Corrosivo',
      nfpa_salud: 0,
      nfpa_inflamabilidad: 0,
      nfpa_inestabilidad: 0,
      nfpa_especial: null,
      es_regulado: false,
      entidades_regulatorias: [],
      es_uso_comun: false,
      ultimo_precio: null,
      moneda_precio: 'USD',
      fecha_ultimo_precio: null,
      activo: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      stock,
    })

    const availableReagent = makeMockReagent('test-1', 'RCT-01', {
      id: 's1',
      laboratorio_id: 'l1',
      cantidad_actual: 500,
      umbral_minimo: 200,
      unidad_medida: 'ml',
      ubicacion_fisica: 'Estante 1',
      fecha_vencimiento: null,
      lote: null,
      estado_fisico: 'DISPONIBLE',
    })

    const lowStockReagent = makeMockReagent('test-2', 'RCT-02', {
      id: 's2',
      laboratorio_id: 'l1',
      cantidad_actual: 150,
      umbral_minimo: 200,
      unidad_medida: 'ml',
      ubicacion_fisica: 'Estante 1',
      fecha_vencimiento: null,
      lote: null,
      estado_fisico: 'DISPONIBLE',
    })

    const exactThresholdReagent = makeMockReagent('test-3', 'RCT-03', {
      id: 's3',
      laboratorio_id: 'l1',
      cantidad_actual: 200,
      umbral_minimo: 200,
      unidad_medida: 'ml',
      ubicacion_fisica: 'Estante 1',
      fecha_vencimiento: null,
      lote: null,
      estado_fisico: 'DISPONIBLE',
    })

    const zeroStockReagent = makeMockReagent('test-4', 'RCT-04', {
      id: 's4',
      laboratorio_id: 'l1',
      cantidad_actual: 0,
      umbral_minimo: 200,
      unidad_medida: 'ml',
      ubicacion_fisica: 'Estante 1',
      fecha_vencimiento: null,
      lote: null,
      estado_fisico: 'AGOTADO',
    })

    const noStockReagent = makeMockReagent('test-5', 'RCT-05', null)

    // Stock > umbral -> DISPONIBLE
    expect(getReagentStockStatus(availableReagent)).toBe('DISPONIBLE')

    // 0 < Stock < umbral -> ESCASEZ
    expect(getReagentStockStatus(lowStockReagent)).toBe('ESCASEZ')

    // Stock == umbral -> ESCASEZ
    expect(getReagentStockStatus(exactThresholdReagent)).toBe('ESCASEZ')

    // Stock == 0 -> ESCASEZ (unificado)
    expect(getReagentStockStatus(zeroStockReagent)).toBe('ESCASEZ')

    // Sin stock -> ESCASEZ
    expect(getReagentStockStatus(noStockReagent)).toBe('ESCASEZ')
  })

  it('fetches stock alerts for laboratory (HU07 Criterio 3 y 4)', async () => {
    const alerts = await reagentsService.getStockAlerts('lepa-seed-id')
    expect(alerts).toBeDefined()
    expect(Array.isArray(alerts)).toBe(true)

    // Check alert structure
    for (const alert of alerts) {
      expect(alert).toHaveProperty('tipo')
      expect(alert.tipo).toBe('ESCASEZ')
      expect(alert).toHaveProperty('mensaje')
      expect(alert.mensaje).toContain('en escasez')
      expect(alert).toHaveProperty('codigoUnico')
    }
  })

  it('records/updates physical stock for a reagent (HU04)', async () => {
    const reagents = await reagentsService.getReagents()
    const targetReagent = reagents[0]
    expect(targetReagent).toBeDefined()
    if (!targetReagent) {
      throw new Error('Reagents list is empty')
    }

    const stockInput = {
      reactivo_id: targetReagent.id,
      laboratorio_id: targetReagent.stock?.laboratorio_id || '63c2b89a-ecbb-4209-bb32-178861f7c49b',
      cantidad_actual: 1200,
      unidad_medida: 'ml',
      ubicacion_fisica: 'Gabinete de Ácidos Modificado',
      umbral_minimo: 400,
      fecha_vencimiento: '2027-12-31',
      lote: 'L-MOD-2026',
      ultimo_precio_adquirido: 48.5,
      moneda_precio: 'USD' as const,
    }

    const res = await reagentsService.upsertStock(stockInput)
    expect(res).toBeDefined()
    expect(res.error).toBeNull()
    expect(res.data).toBeDefined()
    expect(res.data?.cantidad_actual).toBe(1200)
  })
})
