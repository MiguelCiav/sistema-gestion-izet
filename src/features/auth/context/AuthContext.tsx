import React, { createContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase'
import type { Database } from '../../../types/database.types'

export type Perfil = Database['public']['Tables']['perfiles']['Row']

export interface SignUpParams {
  email: string
  password: string
  nombreCompleto: string
  rol?: 'admin' | 'analista' | 'investigador'
  laboratorioCodigo?: 'LEPA' | 'LEM'
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Perfil | null
  isLoading: boolean
  isGuest: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (params: SignUpParams) => Promise<{ error: Error | null }>
  signInAsGuest: () => void
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Perfil | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setProfile(data)
      } else {
        setProfile(null)
      }
    } catch {
      setProfile(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        setUser(data.session?.user ?? null)
        if (data.session?.user) {
          await fetchProfile(data.session.user.id)
        }
      } catch {
        // Error handling for auth session
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) {
          setIsGuest(false)
          await fetchProfile(newSession.user.id)
        } else {
          setProfile(null)
        }
        setIsLoading(false)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        return { error: new Error(error.message) }
      }
      setIsGuest(false)
      return { error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado al iniciar sesión'
      return { error: new Error(message) }
    }
  }

  const signUp = async ({
    email,
    password,
    nombreCompleto,
    rol = 'analista',
    laboratorioCodigo = 'LEPA',
  }: SignUpParams) => {
    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}` : undefined
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nombre_completo: nombreCompleto,
            rol,
            laboratorio_codigo: laboratorioCodigo,
          },
        },
      })
      if (error) {
        return { error: new Error(error.message) }
      }
      return { error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario'
      return { error: new Error(message) }
    }
  }

  const signInAsGuest = () => {
    setUser({
      id: 'guest-user',
      app_metadata: {},
      user_metadata: { nombre_completo: 'Invitado' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User)
    setProfile({
      id: 'guest-user',
      email: 'invitado@izt.ciens.ucv.ve',
      nombre_completo: 'Usuario Invitado',
      rol: 'invitado',
      laboratorio_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    setIsGuest(true)
    setIsLoading(false)
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      if (!isGuest) {
        await supabase.auth.signOut()
      }
    } finally {
      setUser(null)
      setSession(null)
      setProfile(null)
      setIsGuest(false)
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user && !isGuest) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isGuest,
        signIn,
        signUp,
        signInAsGuest,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
