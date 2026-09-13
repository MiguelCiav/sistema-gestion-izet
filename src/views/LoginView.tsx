import React, { useState } from 'react'
import { LogoContainer } from '../components/ui/LogoContainer'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context'

export interface LoginViewProps {
  onGoToOnboarding: () => void
}

export const LoginView: React.FC<LoginViewProps> = ({ onGoToOnboarding }) => {
  const { signIn, signInAsGuest } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor ingrese su usuario/correo y contraseña')
      return
    }

    setIsLoading(true)
    const { error } = await signIn(email.trim(), password)
    setIsLoading(false)

    if (error) {
      setErrorMessage(
        error.message === 'Invalid login credentials'
          ? 'Credenciales inválidas. Verifique su correo y contraseña.'
          : error.message
      )
    }
  }

  return (
    <div className="min-h-screen bg-surface-warm flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Logo Container with tactile stacked deck */}
        <div className="mb-8">
          <LogoContainer size="md" showIcon customText="Logo" />
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-8 tracking-tight">
          ¡Bienvenido!
        </h1>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="w-full mb-6 p-3.5 rounded-xl bg-error-container text-on-error-container text-xs sm:text-sm font-sans font-medium text-left border border-error/20"
          >
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4" noValidate>
          <Input
            type="email"
            placeholder="Ingrese su usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            aria-label="Correo o usuario"
          />

          <Input
            type="password"
            placeholder="Ingrese su contraseña"
            showPasswordToggle
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            aria-label="Contraseña"
          />

          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              variant="primary"
              isFullWidth
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>

            <Button
              type="button"
              variant="outline"
              isFullWidth
              onClick={onGoToOnboarding}
              disabled={isLoading}
            >
              Registrarse
            </Button>
          </div>
        </form>

        {/* Guest access option */}
        <div className="mt-6">
          <button
            type="button"
            onClick={signInAsGuest}
            disabled={isLoading}
            className="text-xs sm:text-sm font-sans font-medium text-on-surface-variant/90 hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Ingresar como invitado
          </button>
        </div>
      </div>
    </div>
  )
}
