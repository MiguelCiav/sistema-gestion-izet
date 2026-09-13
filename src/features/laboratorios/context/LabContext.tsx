import React, { createContext, useEffect, useState, useMemo } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Database } from '../../../types/database.types'
import { useAuth } from '../../auth'

export type Laboratorio = Database['public']['Tables']['laboratorios']['Row']

export interface LabContextType {
  activeLab: 'LEPA' | 'LEM'
  activeLabId: string | null
  activeLabNombre: string
  laboratorios: Laboratorio[]
  isLoadingLabs: boolean
  switchLab: (labCodigo: 'LEPA' | 'LEM') => void
}

const LabContext = createContext<LabContextType | undefined>(undefined)

const DEFAULT_LAB_STORAGE_KEY = 'terra_lab_active_sede'

const getStoredLab = (): 'LEPA' | 'LEM' => {
  try {
    if (
      typeof window !== 'undefined' &&
      window.localStorage &&
      typeof window.localStorage.getItem === 'function'
    ) {
      const saved = window.localStorage.getItem(DEFAULT_LAB_STORAGE_KEY)
      if (saved === 'LEM') return 'LEM'
    }
  } catch {
    // Storage restricted or disabled
  }
  return 'LEPA'
}

const setStoredLab = (lab: 'LEPA' | 'LEM') => {
  try {
    if (
      typeof window !== 'undefined' &&
      window.localStorage &&
      typeof window.localStorage.setItem === 'function'
    ) {
      window.localStorage.setItem(DEFAULT_LAB_STORAGE_KEY, lab)
    }
  } catch {
    // Storage restricted
  }
}

export const LabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth()
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [isLoadingLabs, setIsLoadingLabs] = useState(true)
  const [activeLab, setActiveLab] = useState<'LEPA' | 'LEM'>(getStoredLab)

  // Fetch registered labs from Supabase
  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const { data, error } = await supabase
          .from('laboratorios')
          .select('*')
          .eq('activo', true)

        if (!error && data && data.length > 0) {
          setLaboratorios(data)
        } else {
          // Fallback static seeds in case offline/unconnected
          setLaboratorios([
            {
              id: 'lepa-seed-id',
              codigo: 'LEPA',
              nombre: 'Laboratorio de Ecología de Poblaciones de Artrópodos',
              descripcion: 'Laboratorio IZT - UCV',
              activo: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 'lem-seed-id',
              codigo: 'LEM',
              nombre: 'Laboratorio de Entomología Médica',
              descripcion: 'Laboratorio IZT - UCV',
              activo: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
        }
      } catch {
        // Fallback static seeds
        setLaboratorios([
          {
            id: 'lepa-seed-id',
            codigo: 'LEPA',
            nombre: 'Laboratorio de Ecología de Poblaciones de Artrópodos',
            descripcion: 'Laboratorio IZT - UCV',
            activo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'lem-seed-id',
            codigo: 'LEM',
            nombre: 'Laboratorio de Entomología Médica',
            descripcion: 'Laboratorio IZT - UCV',
            activo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
      } finally {
        setIsLoadingLabs(false)
      }
    }

    fetchLaboratorios()
  }, [])

  // Sync with user's assigned lab if not admin
  useEffect(() => {
    if (profile?.laboratorio_id && laboratorios.length > 0) {
      const userLab = laboratorios.find((l) => l.id === profile.laboratorio_id)
      if (userLab && (userLab.codigo === 'LEPA' || userLab.codigo === 'LEM')) {
        // Non-admin users are pinned to their assigned lab
        if (profile.rol !== 'admin') {
          setActiveLab(userLab.codigo)
          setStoredLab(userLab.codigo)
        }
      }
    }
  }, [profile, laboratorios])

  const switchLab = (labCodigo: 'LEPA' | 'LEM') => {
    setActiveLab(labCodigo)
    setStoredLab(labCodigo)
  }

  const activeLabRecord = useMemo(() => {
    return laboratorios.find((l) => l.codigo === activeLab)
  }, [laboratorios, activeLab])

  const activeLabId = activeLabRecord?.id ?? null
  const activeLabNombre =
    activeLabRecord?.nombre ??
    (activeLab === 'LEPA'
      ? 'Laboratorio de Ecología de Poblaciones de Artrópodos'
      : 'Laboratorio de Entomología Médica')

  return (
    <LabContext.Provider
      value={{
        activeLab,
        activeLabId,
        activeLabNombre,
        laboratorios,
        isLoadingLabs,
        switchLab,
      }}
    >
      {children}
    </LabContext.Provider>
  )
}

export { LabContext }
