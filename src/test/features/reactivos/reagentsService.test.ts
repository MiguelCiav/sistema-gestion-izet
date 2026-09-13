import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reagentsService, type CreateReagentInput } from '../../../features/reactivos/services/reagentsService'

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
})
