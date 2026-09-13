import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import { LogoContainer } from '../../../components/ui/LogoContainer'
import { ProgressStepper } from '../../../components/ui/ProgressStepper'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { useLab } from '../../laboratorios'

export interface OnboardingSetupViewProps {
  onFinishOnboarding: () => void
}

const steps = [
  { id: 'lab', label: 'Laboratorio' },
  { id: 'datos', label: 'Datos' },
  { id: 'confirmacion', label: 'Confirmación' },
]

export const OnboardingSetupView: React.FC<OnboardingSetupViewProps> = ({
  onFinishOnboarding,
}) => {
  const { signUp } = useAuth()
  const { switchLab } = useLab()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedLab, setSelectedLab] = useState<'LEPA' | 'LEM'>('LEPA')

  // Step 2 Form state
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectLab = (lab: 'LEPA' | 'LEM') => {
    setSelectedLab(lab)
    switchLab(lab)
    setCurrentStep(1)
  }

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!nombre.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Por favor complete todos los campos')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)
    const targetEmail = email.trim()
    const { error } = await signUp({
      email: targetEmail,
      password,
      nombreCompleto: nombre.trim(),
      rol: 'analista', // Registro como usuario estándar; administradores asignados en base de datos
      laboratorioCodigo: selectedLab,
    })
    setIsLoading(false)

    if (error) {
      setErrorMessage(error.message)
    } else {
      setRegisteredEmail(targetEmail)
      setCurrentStep(2)
    }
  }

  return (
    <div className="min-h-screen bg-surface-warm flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Logo Container with tactile stacked deck */}
        <div className="mb-6">
          <LogoContainer size="md" showIcon customText="Logo" />
        </div>

        {/* Stepper */}
        <div className="w-full mb-8">
          <ProgressStepper steps={steps} currentStep={currentStep} />
        </div>

        {/* STEP 1: Seleccionar Laboratorio */}
        {currentStep === 0 && (
          <div className="w-full animate-in fade-in duration-200">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4 tracking-tight">
              ¡Bienvenido!
            </h1>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant mb-8 leading-relaxed">
              Selecciona el laboratorio al que perteneces para continuar con tu registro:
            </p>

            <div className="space-y-4">
              <Button
                type="button"
                variant="primary"
                isFullWidth
                size="lg"
                onClick={() => handleSelectLab('LEPA')}
              >
                LEPA
              </Button>

              <Button
                type="button"
                variant="primary"
                isFullWidth
                size="lg"
                onClick={() => handleSelectLab('LEM')}
              >
                LEM
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Datos del Usuario */}
        {currentStep === 1 && (
          <div className="w-full animate-in fade-in duration-200">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-3 tracking-tight">
              Crear Cuenta de Usuario
            </h1>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
              Ingresa tus datos personales y credenciales de acceso para registrarte en el sistema.
            </p>

            {errorMessage && (
              <div
                role="alert"
                className="w-full mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-xs font-sans font-medium text-left border border-error/20"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegisterUser} className="w-full space-y-3.5 text-left" noValidate>
              <Input
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={isLoading}
                required
              />

              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />

              <Input
                type="password"
                placeholder="Contraseña"
                showPasswordToggle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />

              <Input
                type="password"
                placeholder="Confirma tu contraseña"
                showPasswordToggle
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />

              <div className="pt-4 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  isFullWidth
                  onClick={() => setCurrentStep(0)}
                  disabled={isLoading}
                >
                  Volver
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  isFullWidth
                  isLoading={isLoading}
                >
                  Continuar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Confirmación y Verificación de Correo */}
        {currentStep === 2 && (
          <div className="w-full animate-in fade-in duration-200 flex flex-col items-center">
            <div className="mb-4 h-16 w-16 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Mail className="h-8 w-8 stroke-[2.5]" />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-3 tracking-tight">
              ¡Registro Exitoso!
            </h1>

            <p className="font-sans text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
              Hemos registrado tu cuenta para el laboratorio{' '}
              <strong className="text-primary font-bold">{selectedLab}</strong>.
            </p>

            <div className="w-full mb-6 p-4 rounded-xl bg-surface-container text-left border border-outline-variant/30 space-y-2">
              <p className="text-xs sm:text-sm font-sans text-on-surface leading-relaxed">
                Te hemos enviado un enlace de confirmación a:
              </p>
              <p className="text-xs sm:text-sm font-sans font-bold text-primary break-all">
                {registeredEmail || email}
              </p>
              <p className="text-xs font-sans text-on-surface-variant pt-1 leading-relaxed">
                Por favor, abre el enlace en tu correo para activar tu cuenta antes de iniciar sesión.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              isFullWidth
              size="lg"
              onClick={onFinishOnboarding}
            >
              Ir a Iniciar Sesión
            </Button>

            <p className="mt-4 text-xs font-sans text-on-surface-variant/80">
              ¿No recibiste el correo? Revisa tu carpeta de spam o correo no deseado.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
