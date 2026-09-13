export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      laboratorios: {
        Row: {
          id: string
          codigo: string
          nombre: string
          descripcion: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          nombre: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          nombre?: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      perfiles: {
        Row: {
          id: string
          email: string
          nombre_completo: string
          rol: 'admin' | 'analista' | 'investigador' | 'invitado'
          laboratorio_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nombre_completo: string
          rol?: 'admin' | 'analista' | 'investigador' | 'invitado'
          laboratorio_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre_completo?: string
          rol?: 'admin' | 'analista' | 'investigador' | 'invitado'
          laboratorio_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'perfiles_laboratorio_id_fkey'
            columns: ['laboratorio_id']
            isOneToOne: false
            referencedRelation: 'laboratorios'
            referencedColumns: ['id']
          },
        ]
      }
      catalogo_reactivos: {
        Row: {
          id: string
          codigo_unico: string
          nombre: string
          formula_quimica: string | null
          clasificacion_riesgo: string
          nfpa_salud: number
          nfpa_inflamabilidad: number
          nfpa_inestabilidad: number
          nfpa_especial: string | null
          es_regulado: boolean
          entidades_regulatorias: string[]
          es_uso_comun: boolean
          ultimo_precio: number | null
          moneda_precio: 'USD' | 'VES'
          fecha_ultimo_precio: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo_unico: string
          nombre: string
          formula_quimica?: string | null
          clasificacion_riesgo: string
          nfpa_salud?: number
          nfpa_inflamabilidad?: number
          nfpa_inestabilidad?: number
          nfpa_especial?: string | null
          es_regulado?: boolean
          entidades_regulatorias?: string[]
          es_uso_comun?: boolean
          ultimo_precio?: number | null
          moneda_precio?: 'USD' | 'VES'
          fecha_ultimo_precio?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo_unico?: string
          nombre?: string
          formula_quimica?: string | null
          clasificacion_riesgo?: string
          nfpa_salud?: number
          nfpa_inflamabilidad?: number
          nfpa_inestabilidad?: number
          nfpa_especial?: string | null
          es_regulado?: boolean
          entidades_regulatorias?: string[]
          es_uso_comun?: boolean
          ultimo_precio?: number | null
          moneda_precio?: 'USD' | 'VES'
          fecha_ultimo_precio?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      stock_reactivos: {
        Row: {
          id: string
          reactivo_id: string
          laboratorio_id: string
          cantidad_actual: number
          unidad_medida: string
          ubicacion_fisica: string
          umbral_minimo: number
          fecha_vencimiento: string | null
          lote: string | null
          ultimo_precio_adquirido: number | null
          moneda_precio: 'USD' | 'VES'
          es_uso_comun: boolean
          estado_fisico: 'DISPONIBLE' | 'EN_PRESTAMO' | 'AGOTADO'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reactivo_id: string
          laboratorio_id: string
          cantidad_actual?: number
          unidad_medida: string
          ubicacion_fisica: string
          umbral_minimo?: number
          fecha_vencimiento?: string | null
          lote?: string | null
          ultimo_precio_adquirido?: number | null
          moneda_precio?: 'USD' | 'VES'
          es_uso_comun?: boolean
          estado_fisico?: 'DISPONIBLE' | 'EN_PRESTAMO' | 'AGOTADO'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reactivo_id?: string
          laboratorio_id?: string
          cantidad_actual?: number
          unidad_medida?: string
          ubicacion_fisica?: string
          umbral_minimo?: number
          fecha_vencimiento?: string | null
          lote?: string | null
          ultimo_precio_adquirido?: number | null
          moneda_precio?: 'USD' | 'VES'
          es_uso_comun?: boolean
          estado_fisico?: 'DISPONIBLE' | 'EN_PRESTAMO' | 'AGOTADO'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'stock_reactivos_reactivo_id_fkey'
            columns: ['reactivo_id']
            isOneToOne: false
            referencedRelation: 'catalogo_reactivos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'stock_reactivos_laboratorio_id_fkey'
            columns: ['laboratorio_id']
            isOneToOne: false
            referencedRelation: 'laboratorios'
            referencedColumns: ['id']
          },
        ]
      }
      bitacora_movimientos: {
        Row: {
          id: string
          laboratorio_id: string
          reactivo_id: string
          usuario_id: string
          tipo_movimiento:
            | 'CONSUMO'
            | 'INGRESO'
            | 'AJUSTE'
            | 'PRESTAMO_SALIDA'
            | 'PRESTAMO_RETORNO'
            | 'BAJA'
          cantidad: number
          unidad_medida: string
          stock_anterior: number
          stock_posterior: number
          motivo: string | null
          created_at: string
        }
        Insert: {
          id?: string
          laboratorio_id: string
          reactivo_id: string
          usuario_id: string
          tipo_movimiento:
            | 'CONSUMO'
            | 'INGRESO'
            | 'AJUSTE'
            | 'PRESTAMO_SALIDA'
            | 'PRESTAMO_RETORNO'
            | 'BAJA'
          cantidad: number
          unidad_medida: string
          stock_anterior: number
          stock_posterior: number
          motivo?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          laboratorio_id?: string
          reactivo_id?: string
          usuario_id?: string
          tipo_movimiento?:
            | 'CONSUMO'
            | 'INGRESO'
            | 'AJUSTE'
            | 'PRESTAMO_SALIDA'
            | 'PRESTAMO_RETORNO'
            | 'BAJA'
          cantidad?: number
          unidad_medida?: string
          stock_anterior?: number
          stock_posterior?: number
          motivo?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bitacora_movimientos_laboratorio_id_fkey'
            columns: ['laboratorio_id']
            isOneToOne: false
            referencedRelation: 'laboratorios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bitacora_movimientos_reactivo_id_fkey'
            columns: ['reactivo_id']
            isOneToOne: false
            referencedRelation: 'catalogo_reactivos'
            referencedColumns: ['id']
          },
        ]
      }
      prestamos: {
        Row: {
          id: string
          laboratorio_origen_id: string
          reactivo_id: string
          solicitante_nombre: string
          solicitante_cedula: string
          solicitante_institucion: string
          solicitante_contacto: string | null
          tipo_prestamo: 'FRASCO_COMPLETO' | 'FRACCION'
          cantidad_prestada: number
          unidad_medida: string
          fecha_prestamo: string
          fecha_estimada_devolucion: string
          fecha_devolucion_real: string | null
          estado:
            | 'ACTIVO'
            | 'DEVUELTO'
            | 'DEVUELTO_PARCIAL'
            | 'EXTRAVIADO'
            | 'CONSUMIDO_TOTAL'
          observaciones: string | null
          usuario_registro_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          laboratorio_origen_id: string
          reactivo_id: string
          solicitante_nombre: string
          solicitante_cedula: string
          solicitante_institucion: string
          solicitante_contacto?: string | null
          tipo_prestamo: 'FRASCO_COMPLETO' | 'FRACCION'
          cantidad_prestada: number
          unidad_medida: string
          fecha_prestamo?: string
          fecha_estimada_devolucion: string
          fecha_devolucion_real?: string | null
          estado?:
            | 'ACTIVO'
            | 'DEVUELTO'
            | 'DEVUELTO_PARCIAL'
            | 'EXTRAVIADO'
            | 'CONSUMIDO_TOTAL'
          observaciones?: string | null
          usuario_registro_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          laboratorio_origen_id?: string
          reactivo_id?: string
          solicitante_nombre?: string
          solicitante_cedula?: string
          solicitante_institucion?: string
          solicitante_contacto?: string | null
          tipo_prestamo?: 'FRASCO_COMPLETO' | 'FRACCION'
          cantidad_prestada?: number
          unidad_medida?: string
          fecha_prestamo?: string
          fecha_estimada_devolucion?: string
          fecha_devolucion_real?: string | null
          estado?:
            | 'ACTIVO'
            | 'DEVUELTO'
            | 'DEVUELTO_PARCIAL'
            | 'EXTRAVIADO'
            | 'CONSUMIDO_TOTAL'
          observaciones?: string | null
          usuario_registro_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'prestamos_laboratorio_origen_id_fkey'
            columns: ['laboratorio_origen_id']
            isOneToOne: false
            referencedRelation: 'laboratorios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'prestamos_reactivo_id_fkey'
            columns: ['reactivo_id']
            isOneToOne: false
            referencedRelation: 'catalogo_reactivos'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      get_auth_user_lab_id: {
        Args: Record<string, never>
        Returns: string | null
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
