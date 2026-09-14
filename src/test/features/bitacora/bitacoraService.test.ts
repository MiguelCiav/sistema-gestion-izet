import { describe, it, expect, beforeEach, vi } from 'vitest'
import { bitacoraService } from '../../../features/bitacora/services/bitacoraService'

describe('bitacoraService (HU06)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches chronological list of inventory movements', async () => {
    const movements = await bitacoraService.getMovimientos()
    expect(movements).toBeDefined()
    expect(Array.isArray(movements)).toBe(true)
    expect(movements.length).toBeGreaterThan(0)

    const first = movements[0]
    expect(first).toHaveProperty('id')
    expect(first).toHaveProperty('tipo_movimiento')
    expect(first).toHaveProperty('cantidad')
    expect(first).toHaveProperty('unidad_medida')
    expect(first).toHaveProperty('stock_anterior')
    expect(first).toHaveProperty('stock_posterior')
    expect(first).toHaveProperty('created_at')
  })

  it('filters movements by tipoMovimiento (HU06 Criterio 4)', async () => {
    const consumos = await bitacoraService.getMovimientos(null, { tipoMovimiento: 'CONSUMO' })
    expect(consumos.length).toBeGreaterThan(0)
    expect(consumos.every((m) => m.tipo_movimiento === 'CONSUMO')).toBe(true)

    const ingresos = await bitacoraService.getMovimientos(null, { tipoMovimiento: 'INGRESO' })
    expect(ingresos.length).toBeGreaterThan(0)
    expect(ingresos.every((m) => m.tipo_movimiento === 'INGRESO')).toBe(true)
  })

  it('filters movements by search query across reagent, responsible and reason', async () => {
    const byReagent = await bitacoraService.getMovimientos(null, { searchQuery: 'Clorhídrico' })
    expect(byReagent.length).toBeGreaterThan(0)
    expect(
      byReagent.some((m) => m.reactivo?.nombre.toLowerCase().includes('clorhídrico'))
    ).toBe(true)

    const byResponsable = await bitacoraService.getMovimientos(null, { searchQuery: 'Morales' })
    expect(byResponsable.length).toBeGreaterThan(0)
    expect(
      byResponsable.some((m) => m.nombre_responsable?.toLowerCase().includes('morales'))
    ).toBe(true)
  })

  it('allows adding fallback entries dynamically', () => {
    const initialCount = bitacoraService.filterFallback().length
    bitacoraService.addFallbackMovimiento({
      id: `bit-test-${Date.now()}`,
      laboratorio_id: 'lab-test',
      reactivo_id: 'reagent-test',
      usuario_id: null,
      nombre_responsable: 'Test Auditor',
      tipo_movimiento: 'AJUSTE',
      cantidad: 5,
      unidad_medida: 'ml',
      stock_anterior: 10,
      stock_posterior: 5,
      motivo: 'Ajuste de prueba unitaria',
      created_at: new Date().toISOString(),
      reactivo: {
        id: 'reagent-test',
        codigo_unico: 'RCT-TST-01',
        nombre: 'Reactivo Test',
        formula_quimica: 'TST',
        nfpa_salud: 1,
        nfpa_inflamabilidad: 1,
        nfpa_inestabilidad: 0,
        nfpa_especial: null,
        clasificacion_riesgo: 'Tóxico',
      },
    })

    const afterCount = bitacoraService.filterFallback().length
    expect(afterCount).toBe(initialCount + 1)
  })
})
