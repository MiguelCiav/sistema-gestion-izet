import React, { useState } from 'react'
import { AuthProvider, useAuth, LabProvider } from './context'
import { LoginView } from './views/LoginView'
import { OnboardingSetupView } from './views/OnboardingSetupView'
import { DashboardView } from './views/DashboardView'
import { Loader2 } from 'lucide-react'

export function AppContent(): React.JSX.Element {
  const { user, isGuest, isLoading } = useAuth()
  const [view, setView] = useState<'login' | 'onboarding'>('login')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-warm flex flex-col items-center justify-center p-6 text-primary">
        <Loader2 className="h-10 w-10 animate-spin mb-3 stroke-[2.5]" />
        <p className="font-sans text-sm font-semibold text-on-surface-variant">
          Cargando Sistema LEPA-LEM...
        </p>
      </div>
    )
  }

  // If user is authenticated or logged in as guest -> Show Dashboard
  if (user || isGuest) {
    return <DashboardView />
  }

  // Unauthenticated routing: Onboarding vs Login
  if (view === 'onboarding') {
    return <OnboardingSetupView onFinishOnboarding={() => setView('login')} />
  }

  return <LoginView onGoToOnboarding={() => setView('onboarding')} />
}

export function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <LabProvider>
        <AppContent />
      </LabProvider>
    </AuthProvider>
  )
}

export default App
