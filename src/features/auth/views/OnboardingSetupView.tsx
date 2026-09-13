import React, { useState } from 'react'
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectLab = (lab: 'LEPA' | 'LEM') => {
    setSelectedLab(lab)
    switchLab(lab)
    setCurrentStep(1)
  }

  const handleRegisterAdmin = async (e: React.FormEvent) => {
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
    const { error } = await signUp({
      email: email.trim(),
      password,
      nombreCompleto: nombre.trim(),
      rol: 'admin',
      laboratorioCodigo: selectedLab,
    })
    setIsLoading(false)

    if (error) {
      setErrorMessage(error.message)
    } else {
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
              Antes de comenzar, escoge el laboratorio en el que será usada esta instancia del
              sistema:
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

        {/* STEP 2: Datos del Administrador */}
        {currentStep === 1 && (
          <div className="w-full animate-in fade-in duration-200">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-3 tracking-tight">
              ¿Cómo debemos recordarte?
            </h1>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
              Ingresa tus datos de inicio de sesión como administrador, este usuario tendrá
              permisos especiales, por lo que es importante que anotes sus credenciales en un
              lugar seguro.
            </p>

            {errorMessage && (
              <div
                role="alert"
                className="w-full mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-xs font-sans font-medium text-left border border-error/20"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegisterAdmin} className="w-full space-y-3.5 text-left" noValidate>
              <Input
                placeholder="Usuario (Nombre completo)"
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
                placeholder="Clave"
                showPasswordToggle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />

              <Input
                type="password"
                placeholder="Confirma tu clave"
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

        {/* STEP 3: Confirmación y Éxito */}
        {currentStep === 2 && (
          <div className="w-full animate-in fade-in duration-200">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4 tracking-tight">
              ¡Todo listo!
            </h1>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant mb-8 leading-relaxed">
              Ya el sistema para el laboratorio <strong className="text-primary">{selectedLab}</strong> está
              configurado, puedes iniciar sesión:
            </p>

            <Button
              type="button"
              variant="primary"
              isFullWidth
              size="lg"
              onClick={onFinishOnboarding}
            >
              Iniciar Sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
