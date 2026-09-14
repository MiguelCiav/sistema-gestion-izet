import { supabase } from '../../../lib/supabase'
import type { Database } from '../../../types/database.types'

export type BitacoraMovimientoRow = Database['public']['Tables']['bitacora_movimientos']['Row']

export interface BitacoraEntry extends BitacoraMovimientoRow {
  reactivo?: {
    id: string
    codigo_unico: string
    nombre: string
    formula_quimica: string | null
    nfpa_salud: number
    nfpa_inflamabilidad: number
    nfpa_inestabilidad: number
    nfpa_especial: string | null
    clasificacion_riesgo?: string
  } | null
}

export type TipoMovimientoFiltro =
  | 'TODOS'
  | 'CONSUMO'
  | 'INGRESO'
  | 'AJUSTE'
  | 'PRESTAMO'
  | 'BAJA'

export interface BitacoraFilters {
  tipoMovimiento?: TipoMovimientoFiltro
  searchQuery?: string
  fechaInicio?: string
  fechaFin?: string
}

// Semillas iniciales en memoria para entornos offline o de prueba
export const FALLBACK_BITACORA: BitacoraEntry[] = [
  {
    id: 'bit-001',
    laboratorio_id: 'lepa-lab-001',
    reactivo_id: 'seed-hcl-01',
    usuario_id: null,
    nombre_responsable: 'Lic. Elena Morales',
    tipo_movimiento: 'CONSUMO',
    cantidad: 50,
    unidad_medida: 'ml',
    stock_anterior: 500,
    stock_posterior: 450,
    motivo: 'Preparación de solución valorada para análisis de aguas',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Hace 1 día
    reactivo: {
      id: 'seed-hcl-01',
      codigo_unico: 'RCT-HCL-01',
      nombre: 'Ácido Clorhídrico 37%',
      formula_quimica: 'HCl',
      nfpa_salud: 3,
      nfpa_inflamabilidad: 0,
      nfpa_inestabilidad: 1,
      nfpa_especial: null,
      clasificacion_riesgo: 'Corrosivo',
    },
  },
  {
    id: 'bit-002',
    laboratorio_id: 'lepa-lab-001',
    reactivo_id: 'seed-etoh-02',
    usuario_id: null,
    nombre_responsable: 'Tesista Marcos Silva',
    tipo_movimiento: 'CONSUMO',
    cantidad: 200,
    unidad_medida: 'ml',
    stock_anterior: 1000,
    stock_posterior: 800,
    motivo: 'Extracción de pigmentos vegetales - Trabajo Especial de Grado',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // Hace 2 días
    reactivo: {
      id: 'seed-etoh-02',
      codigo_unico: 'RCT-ETOH-02',
      nombre: 'Etanol Absoluto 99.8%',
      formula_quimica: 'C2H5OH',
      nfpa_salud: 2,
      nfpa_inflamabilidad: 3,
      nfpa_inestabilidad: 0,
      nfpa_especial: null,
      clasificacion_riesgo: 'Inflamable',
    },
  },
  {
    id: 'bit-003',
    laboratorio_id: 'lepa-lab-001',
    reactivo_id: 'seed-hcl-01',
    usuario_id: null,
    nombre_responsable: 'Dr. Arnaldo Ferrer',
    tipo_movimiento: 'INGRESO',
    cantidad: 500,
    unidad_medida: 'ml',
    stock_anterior: 0,
    stock_posterior: 500,
    motivo: 'Adquisición de lote inicial para investigación',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // Hace 3 días
    reactivo: {
      id: 'seed-hcl-01',
      codigo_unico: 'RCT-HCL-01',
      nombre: 'Ácido Clorhídrico 37%',
      formula_quimica: 'HCl',
      nfpa_salud: 3,
      nfpa_inflamabilidad: 0,
      nfpa_inestabilidad: 1,
      nfpa_especial: null,
      clasificacion_riesgo: 'Corrosivo',
    },
  },
  {
    id: 'bit-004',
    laboratorio_id: 'lepa-lab-001',
    reactivo_id: 'seed-naoh-03',
    usuario_id: null,
    nombre_responsable: 'Dra. Carmen Rivas',
    tipo_movimiento: 'AJUSTE',
    cantidad: 100,
    unidad_medida: 'g',
    stock_anterior: 100,
    stock_posterior: 0,
    motivo: 'Ajuste por inventario físico - material agotado en prácticas',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // Hace 4 días
    reactivo: {
      id: 'seed-naoh-03',
      codigo_unico: 'RCT-NAOH-03',
      nombre: 'Hidróxido de Sodio en Lentejas',
      formula_quimica: 'NaOH',
      nfpa_salud: 3,
      nfpa_inflamabilidad: 0,
      nfpa_inestabilidad: 1,
      nfpa_especial: null,
      clasificacion_riesgo: 'Corrosivo',
    },
  },
]

export const bitacoraService = {
  /**
   * HU06: Consulta la bitácora inmutable de movimientos del laboratorio activo
   */
  async getMovimientos(labId?: string | null, filters?: BitacoraFilters): Promise<BitacoraEntry[]> {
    try {
      let query = supabase
        .from('bitacora_movimientos')
        .select(`
          id,
          laboratorio_id,
          reactivo_id,
          usuario_id,
          nombre_responsable,
          tipo_movimiento,
          cantidad,
          unidad_medida,
          stock_anterior,
          stock_posterior,
          motivo,
          created_at,
          reactivo:catalogo_reactivos (
            id,
            codigo_unico,
            nombre,
            formula_quimica,
            nfpa_salud,
            nfpa_inflamabilidad,
            nfpa_inestabilidad,
            nfpa_especial,
            clasificacion_riesgo
          )
        `)
        .order('created_at', { ascending: false })

      if (labId) {
        query = query.eq('laboratorio_id', labId)
      }

      if (filters?.tipoMovimiento && filters.tipoMovimiento !== 'TODOS') {
        if (filters.tipoMovimiento === 'PRESTAMO') {
          query = query.in('tipo_movimiento', ['PRESTAMO_SALIDA', 'PRESTAMO_RETORNO'])
        } else {
          query = query.eq('tipo_movimiento', filters.tipoMovimiento)
        }
      }

      const { data, error } = await query

      if (error || !data || data.length === 0) {
        // Fallback local en memoria filtrado
        return this.filterFallback(filters)
      }

      // Normalizar estructura de reactivo devuelta por PostgREST
      let results: BitacoraEntry[] = data.map((item) => ({
        ...item,
        reactivo: Array.isArray(item.reactivo) ? item.reactivo[0] || null : item.reactivo,
      }))

      if (filters?.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase().trim()
        results = results.filter((entry) => {
          const matchReactivo =
            entry.reactivo?.nombre.toLowerCase().includes(q) ||
            entry.reactivo?.codigo_unico.toLowerCase().includes(q)
          const matchResponsable = entry.nombre_responsable?.toLowerCase().includes(q)
          const matchMotivo = entry.motivo?.toLowerCase().includes(q)
          return Boolean(matchReactivo || matchResponsable || matchMotivo)
        })
      }

      return results
    } catch {
      return this.filterFallback(filters)
    }
  },

  /**
   * Filtra las semillas locales de prueba
   */
  filterFallback(filters?: BitacoraFilters): BitacoraEntry[] {
    let list = [...FALLBACK_BITACORA]

    if (filters?.tipoMovimiento && filters.tipoMovimiento !== 'TODOS') {
      if (filters.tipoMovimiento === 'PRESTAMO') {
        list = list.filter((e) =>
          ['PRESTAMO_SALIDA', 'PRESTAMO_RETORNO'].includes(e.tipo_movimiento)
        )
      } else {
        list = list.filter((e) => e.tipo_movimiento === filters.tipoMovimiento)
      }
    }

    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase().trim()
      list = list.filter((entry) => {
        const matchReactivo =
          entry.reactivo?.nombre.toLowerCase().includes(q) ||
          entry.reactivo?.codigo_unico.toLowerCase().includes(q)
        const matchResponsable = entry.nombre_responsable?.toLowerCase().includes(q)
        const matchMotivo = entry.motivo?.toLowerCase().includes(q)
        return Boolean(matchReactivo || matchResponsable || matchMotivo)
      })
    }

    return list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  /**
   * Agrega un movimiento a la bitácora local de respaldo (útil en tests)
   */
  addFallbackMovimiento(entry: BitacoraEntry): void {
    FALLBACK_BITACORA.unshift(entry)
  },
}
