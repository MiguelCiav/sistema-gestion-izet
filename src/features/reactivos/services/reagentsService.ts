import { supabase } from '../../../lib/supabase'
import type { Database } from '../../../types/database.types'

export type CatalogoReactivo = Database['public']['Tables']['catalogo_reactivos']['Row']
export type CatalogoReactivoInsert = Database['public']['Tables']['catalogo_reactivos']['Insert']
export type CatalogoReactivoUpdate = Database['public']['Tables']['catalogo_reactivos']['Update']
export type StockReactivo = Database['public']['Tables']['stock_reactivos']['Row']

export type StockStatusType = 'DISPONIBLE' | 'ESCASEZ' | 'SIN_EXISTENCIA'

export interface StockAlert {
  reactivoId: string
  codigoUnico: string
  nombre: string
  tipo: 'ESCASEZ' | 'SIN_EXISTENCIA'
  mensaje: string
  cantidadActual: number
  umbralMinimo: number
  unidadMedida: string
}

export function getReagentStockStatus(reagent: ReagentItem): StockStatusType {
  const stock = reagent.stock
  if (!stock || stock.cantidad_actual <= 0) {
    return 'SIN_EXISTENCIA'
  }
  if (stock.cantidad_actual <= stock.umbral_minimo) {
    return 'ESCASEZ'
  }
  return 'DISPONIBLE'
}

export interface ReagentItem extends CatalogoReactivo {
  stock?: {
    id: string
    laboratorio_id: string
    cantidad_actual: number
    unidad_medida: string
    ubicacion_fisica: string
    umbral_minimo: number
    fecha_vencimiento: string | null
    lote: string | null
    ultimo_precio_adquirido?: number | null
    moneda_precio?: 'USD' | 'VES'
    es_uso_comun?: boolean
    estado_fisico: 'DISPONIBLE' | 'EN_PRESTAMO' | 'AGOTADO'
  } | null
}

export interface ReagentFilters {
  soloRegulados?: boolean
  soloUsoComun?: boolean
  soloEscasez?: boolean
  soloSinExistencia?: boolean
  maxNfpaSalud?: number
  minNfpaSalud?: number
  incluirInactivos?: boolean
}

export interface UpsertStockInput {
  id?: string
  reactivo_id: string
  laboratorio_id: string
  cantidad_actual: number
  unidad_medida: string
  ubicacion_fisica: string
  umbral_minimo: number
  fecha_vencimiento?: string | null
  lote?: string | null
  ultimo_precio_adquirido?: number | null
  moneda_precio?: 'USD' | 'VES'
}

export interface CreateReagentInput extends CatalogoReactivoInsert {
  stockInicial?: {
    cantidad_actual: number
    unidad_medida: string
    ubicacion_fisica: string
    umbral_minimo: number
    fecha_vencimiento?: string | null
    lote?: string | null
  }
}

// Fallback seed catalog for offline / disconnected environments
const FALLBACK_REAGENTS: ReagentItem[] = [
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
    id: 'seed-naoh-03',
    codigo_unico: 'RCT-NAOH-03',
    nombre: 'Hidróxido de Sodio (Lentejas)',
    formula_quimica: 'NaOH',
    clasificacion_riesgo: 'Corrosivo / Alcalino',
    nfpa_salud: 3,
    nfpa_inflamabilidad: 0,
    nfpa_inestabilidad: 1,
    nfpa_especial: null,
    es_regulado: false,
    entidades_regulatorias: [],
    es_uso_comun: false,
    ultimo_precio: 18.0,
    moneda_precio: 'USD',
    fecha_ultimo_precio: '2026-09-01',
    activo: true,
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-01T10:00:00Z',
    stock: {
      id: 'stock-naoh-03',
      laboratorio_id: 'lem-seed-id',
      cantidad_actual: 800,
      unidad_medida: 'g',
      ubicacion_fisica: 'Estante de Bases - LEM',
      umbral_minimo: 250,
      fecha_vencimiento: '2029-01-15',
      lote: 'L-NAOH-2026',
      estado_fisico: 'DISPONIBLE',
    },
  },
  {
    id: 'seed-act-04',
    codigo_unico: 'RCT-ACT-04',
    nombre: 'Acetona Grado Analítico',
    formula_quimica: 'CH3COCH3',
    clasificacion_riesgo: 'Inflamable / Irritante',
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

export const reagentsService = {
  /**
   * Obtiene reactivos del catálogo con su stock correspondiente al laboratorio activo
   */
  async getReagents(labId?: string | null, filters?: ReagentFilters): Promise<ReagentItem[]> {
    try {
      let query = supabase
        .from('catalogo_reactivos')
        .select('*')
        .order('nombre', { ascending: true })

      if (!filters?.incluirInactivos) {
        query = query.eq('activo', true)
      }

      if (filters?.soloRegulados) {
        query = query.eq('es_regulado', true)
      }

      if (filters?.soloUsoComun) {
        query = query.eq('es_uso_comun', true)
      }

      const { data: reagents, error } = await query

      if (error || !reagents || reagents.length === 0) {
        // En caso de error de red o tabla vacía, retornar semillas de respaldo filtradas
        return FALLBACK_REAGENTS.filter((r) => {
          if (!filters?.incluirInactivos && !r.activo) return false
          if (filters?.soloRegulados && !r.es_regulado) return false
          if (filters?.soloUsoComun && !r.es_uso_comun) return false
          if (filters?.soloEscasez && getReagentStockStatus(r) !== 'ESCASEZ') return false
          if (filters?.soloSinExistencia && getReagentStockStatus(r) !== 'SIN_EXISTENCIA') return false
          return true
        })
      }

      // Si tenemos labId, consultar stock_reactivos para enriquecer los reactivos
      let resultReagents: ReagentItem[] = reagents.map((r) => ({ ...r, stock: null }))

      if (labId) {
        const { data: stockItems } = await supabase
          .from('stock_reactivos')
          .select('*')
          .eq('laboratorio_id', labId)

        const stockMap = new Map<string, StockReactivo>()
        if (stockItems) {
          stockItems.forEach((st) => stockMap.set(st.reactivo_id, st))
        }

        resultReagents = reagents.map((r) => {
          const st = stockMap.get(r.id)
          return {
            ...r,
            stock: st
              ? {
                  id: st.id,
                  laboratorio_id: st.laboratorio_id,
                  cantidad_actual: Number(st.cantidad_actual),
                  unidad_medida: st.unidad_medida,
                  ubicacion_fisica: st.ubicacion_fisica,
                  umbral_minimo: Number(st.umbral_minimo),
                  fecha_vencimiento: st.fecha_vencimiento,
                  lote: st.lote,
                  ultimo_precio_adquirido: st.ultimo_precio_adquirido
                    ? Number(st.ultimo_precio_adquirido)
                    : null,
                  moneda_precio: st.moneda_precio,
                  es_uso_comun: st.es_uso_comun,
                  estado_fisico: st.estado_fisico,
                }
              : null,
          }
        })
      }

      // Filtros de stock (HU07)
      if (filters?.soloEscasez) {
        resultReagents = resultReagents.filter((r) => getReagentStockStatus(r) === 'ESCASEZ')
      }
      if (filters?.soloSinExistencia) {
        resultReagents = resultReagents.filter(
          (r) => getReagentStockStatus(r) === 'SIN_EXISTENCIA'
        )
      }

      return resultReagents
    } catch {
      return FALLBACK_REAGENTS.filter((r) => {
        if (!filters?.incluirInactivos && !r.activo) return false
        if (filters?.soloRegulados && !r.es_regulado) return false
        if (filters?.soloUsoComun && !r.es_uso_comun) return false
        if (filters?.soloEscasez && getReagentStockStatus(r) !== 'ESCASEZ') return false
        if (filters?.soloSinExistencia && getReagentStockStatus(r) !== 'SIN_EXISTENCIA') return false
        return true
      })
    }
  },

  /**
   * HU04: Registra o actualiza la existencia física de un reactivo en un laboratorio
   */
  async upsertStock(
    input: UpsertStockInput
  ): Promise<{ data: StockReactivo | null; error: Error | null }> {
    try {
      const estado_fisico: 'DISPONIBLE' | 'AGOTADO' =
        input.cantidad_actual > 0 ? 'DISPONIBLE' : 'AGOTADO'
      const payload: Database['public']['Tables']['stock_reactivos']['Insert'] = {
        reactivo_id: input.reactivo_id,
        laboratorio_id: input.laboratorio_id,
        cantidad_actual: input.cantidad_actual,
        unidad_medida: input.unidad_medida,
        ubicacion_fisica: input.ubicacion_fisica,
        umbral_minimo: input.umbral_minimo,
        fecha_vencimiento: input.fecha_vencimiento || null,
        lote: input.lote || null,
        ultimo_precio_adquirido: input.ultimo_precio_adquirido ?? null,
        moneda_precio: input.moneda_precio || 'USD',
        estado_fisico,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('stock_reactivos')
        .upsert(payload, { onConflict: 'reactivo_id,laboratorio_id' })
        .select()
        .single()

      if (error) {
        // Fallback en memoria si opera desconectado
        const target = FALLBACK_REAGENTS.find((r) => r.id === input.reactivo_id)
        if (target) {
          const fallbackStock: StockReactivo = {
            id: `stock-${input.reactivo_id}-${Date.now()}`,
            reactivo_id: input.reactivo_id,
            laboratorio_id: input.laboratorio_id,
            cantidad_actual: input.cantidad_actual,
            unidad_medida: input.unidad_medida,
            ubicacion_fisica: input.ubicacion_fisica,
            umbral_minimo: input.umbral_minimo,
            fecha_vencimiento: input.fecha_vencimiento || null,
            lote: input.lote || null,
            ultimo_precio_adquirido: input.ultimo_precio_adquirido ?? null,
            moneda_precio: input.moneda_precio || 'USD',
            es_uso_comun: target.es_uso_comun,
            estado_fisico,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          target.stock = fallbackStock
          return { data: fallbackStock, error: null }
        }
        return { data: null, error: new Error(error.message) }
      }

      return { data, error: null }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar stock'
      return { data: null, error: new Error(msg) }
    }
  },

  /**
   * HU07: Obtiene alertas de reactivos para el laboratorio activo
   * - 0 < stock <= umbral -> ESCASEZ (Alerta amarilla/persistente)
   * - stock = 0 o sin existencia -> SIN_EXISTENCIA (Alerta roja)
   */
  async getStockAlerts(labId?: string | null): Promise<StockAlert[]> {
    try {
      const reagents = await this.getReagents(labId)
      const alerts: StockAlert[] = []

      for (const r of reagents) {
        const status = getReagentStockStatus(r)
        if (status === 'ESCASEZ' && r.stock) {
          alerts.push({
            reactivoId: r.id,
            codigoUnico: r.codigo_unico,
            nombre: r.nombre,
            tipo: 'ESCASEZ',
            mensaje: `${r.codigo_unico} escasea`,
            cantidadActual: r.stock.cantidad_actual,
            umbralMinimo: r.stock.umbral_minimo,
            unidadMedida: r.stock.unidad_medida,
          })
        } else if (status === 'SIN_EXISTENCIA') {
          alerts.push({
            reactivoId: r.id,
            codigoUnico: r.codigo_unico,
            nombre: r.nombre,
            tipo: 'SIN_EXISTENCIA',
            mensaje: `${r.codigo_unico} sin existencia`,
            cantidadActual: 0,
            umbralMinimo: r.stock?.umbral_minimo ?? 0,
            unidadMedida: r.stock?.unidad_medida ?? 'ml',
          })
        }
      }

      return alerts
    } catch {
      return []
    }
  },

  /**
   * Obtiene la existencia física de un reactivo específico en un laboratorio
   */
  async getStockByReagentAndLab(
    reactivoId: string,
    labId: string
  ): Promise<StockReactivo | null> {
    try {
      const { data, error } = await supabase
        .from('stock_reactivos')
        .select('*')
        .eq('reactivo_id', reactivoId)
        .eq('laboratorio_id', labId)
        .maybeSingle()

      if (error || !data) {
        const fallbackTarget = FALLBACK_REAGENTS.find((r) => r.id === reactivoId)
        if (fallbackTarget?.stock && fallbackTarget.stock.laboratorio_id === labId) {
          return {
            id: fallbackTarget.stock.id,
            reactivo_id: reactivoId,
            laboratorio_id: labId,
            cantidad_actual: fallbackTarget.stock.cantidad_actual,
            unidad_medida: fallbackTarget.stock.unidad_medida,
            ubicacion_fisica: fallbackTarget.stock.ubicacion_fisica,
            umbral_minimo: fallbackTarget.stock.umbral_minimo,
            fecha_vencimiento: fallbackTarget.stock.fecha_vencimiento,
            lote: fallbackTarget.stock.lote,
            ultimo_precio_adquirido: fallbackTarget.stock.ultimo_precio_adquirido ?? null,
            moneda_precio: fallbackTarget.stock.moneda_precio ?? 'USD',
            es_uso_comun: fallbackTarget.stock.es_uso_comun ?? false,
            estado_fisico: fallbackTarget.stock.estado_fisico,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }
        return null
      }

      return data
    } catch {
      return null
    }
  },

  /**
   * HU03: Valida en tiempo real la disponibilidad y unicidad de un código de reactivo
   */
  async checkCodeAvailability(codigo: string, excludeId?: string): Promise<{ isAvailable: boolean }> {
    const trimmed = codigo.trim()
    if (!trimmed) {
      return { isAvailable: false }
    }

    try {
      let query = supabase
        .from('catalogo_reactivos')
        .select('id, codigo_unico')
        .ilike('codigo_unico', trimmed)

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { data, error } = await query

      if (error) {
        // Validación local de respaldo contra semillas
        const existsLocally = FALLBACK_REAGENTS.some(
          (r) => r.codigo_unico.toLowerCase() === trimmed.toLowerCase() && r.id !== excludeId
        )
        return { isAvailable: !existsLocally }
      }

      return { isAvailable: !data || data.length === 0 }
    } catch {
      const existsLocally = FALLBACK_REAGENTS.some(
        (r) => r.codigo_unico.toLowerCase() === trimmed.toLowerCase() && r.id !== excludeId
      )
      return { isAvailable: !existsLocally }
    }
  },

  /**
   * HU02: Registra un nuevo reactivo en el catálogo y opcionalmente su stock inicial
   */
  async createReagent(
    input: CreateReagentInput,
    labId?: string | null
  ): Promise<{ data: ReagentItem | null; error: Error | null }> {
    try {
      // 1. Validar unicidad de código
      const { isAvailable } = await this.checkCodeAvailability(input.codigo_unico)
      if (!isAvailable) {
        return {
          data: null,
          error: new Error(`El código '${input.codigo_unico}' ya está registrado en el catálogo institucional.`),
        }
      }

      const { stockInicial, ...catalogoData } = input

      // 2. Insertar reactivo en catalogo_reactivos
      const { data: newReagent, error: insertError } = await supabase
        .from('catalogo_reactivos')
        .insert({
          ...catalogoData,
          codigo_unico: catalogoData.codigo_unico.trim().toUpperCase(),
          nombre: catalogoData.nombre.trim(),
          formula_quimica: catalogoData.formula_quimica?.trim() || null,
          clasificacion_riesgo: catalogoData.clasificacion_riesgo.trim(),
          entidades_regulatorias: catalogoData.entidades_regulatorias || [],
        })
        .select()
        .single()

      if (insertError || !newReagent) {
        return { data: null, error: new Error(insertError?.message || 'Error al registrar reactivo') }
      }

      let stockResult = null

      // 3. Si se suministró stock inicial y tenemos labId, registrar en stock_reactivos
      if (stockInicial && labId) {
        const { data: createdStock } = await supabase
          .from('stock_reactivos')
          .insert({
            reactivo_id: newReagent.id,
            laboratorio_id: labId,
            cantidad_actual: stockInicial.cantidad_actual,
            unidad_medida: stockInicial.unidad_medida,
            ubicacion_fisica: stockInicial.ubicacion_fisica,
            umbral_minimo: stockInicial.umbral_minimo,
            fecha_vencimiento: stockInicial.fecha_vencimiento || null,
            lote: stockInicial.lote || null,
            es_uso_comun: catalogoData.es_uso_comun ?? false,
            estado_fisico: stockInicial.cantidad_actual > 0 ? 'DISPONIBLE' : 'AGOTADO',
          })
          .select()
          .single()

        if (createdStock) {
          stockResult = {
            id: createdStock.id,
            laboratorio_id: createdStock.laboratorio_id,
            cantidad_actual: Number(createdStock.cantidad_actual),
            unidad_medida: createdStock.unidad_medida,
            ubicacion_fisica: createdStock.ubicacion_fisica,
            umbral_minimo: Number(createdStock.umbral_minimo),
            fecha_vencimiento: createdStock.fecha_vencimiento,
            lote: createdStock.lote,
            estado_fisico: createdStock.estado_fisico,
          }
        }
      }

      return {
        data: {
          ...newReagent,
          stock: stockResult,
        },
        error: null,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado al crear reactivo'
      return { data: null, error: new Error(message) }
    }
  },

  /**
   * HU02: Actualiza la información de un reactivo en el catálogo
   */
  async updateReagent(
    id: string,
    updates: CatalogoReactivoUpdate
  ): Promise<{ data: CatalogoReactivo | null; error: Error | null }> {
    try {
      if (updates.codigo_unico) {
        const { isAvailable } = await this.checkCodeAvailability(updates.codigo_unico, id)
        if (!isAvailable) {
          return {
            data: null,
            error: new Error(`El código '${updates.codigo_unico}' ya está en uso por otro reactivo.`),
          }
        }
      }

      const { data, error } = await supabase
        .from('catalogo_reactivos')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error || !data) {
        return { data: null, error: new Error(error?.message || 'Error al actualizar reactivo') }
      }

      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar reactivo'
      return { data: null, error: new Error(message) }
    }
  },

  /**
   * HU02 Criterio 1: Baja lógica del reactivo en el catálogo (activo = false)
   */
  async deactivateReagent(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('catalogo_reactivos')
        .update({ activo: false, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        return { error: new Error(error.message) }
      }
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al dar de baja el reactivo'
      return { error: new Error(message) }
    }
  },

  /**
   * HU02 Criterio 7: Eliminación física verificando integridad referencial
   */
  async deleteReagent(id: string): Promise<{ error: Error | null }> {
    try {
      // Verificar si tiene stock físico activo
      const { data: stockRecords } = await supabase
        .from('stock_reactivos')
        .select('id, cantidad_actual')
        .eq('reactivo_id', id)

      if (stockRecords && stockRecords.length > 0) {
        return {
          error: new Error(
            'No se puede eliminar el reactivo porque posee registros de existencias físicas en laboratorios. En su lugar, utilice la opción Dar de Baja (baja lógica).'
          ),
        }
      }

      // Verificar si tiene movimientos en bitácora
      const { data: movements } = await supabase
        .from('bitacora_movimientos')
        .select('id')
        .eq('reactivo_id', id)
        .limit(1)

      if (movements && movements.length > 0) {
        return {
          error: new Error(
            'No se puede eliminar el reactivo porque cuenta con bitácora histórica de movimientos. Se debe dar de baja lógica.'
          ),
        }
      }

      const { error } = await supabase.from('catalogo_reactivos').delete().eq('id', id)
      if (error) {
        return { error: new Error(error.message) }
      }
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar reactivo'
      return { error: new Error(message) }
    }
  },
}
