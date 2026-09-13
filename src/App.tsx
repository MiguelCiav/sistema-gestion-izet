import React from 'react'
import { Button } from './components/ui/Button'

export function App(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <header className="max-w-md rounded-2xl bg-surface-container p-8 shadow-sm border border-outline-variant/30">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          IZT • UCV
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface font-display">
          Sistema LEPA-LEM
        </h1>
        <p className="mt-3 text-sm text-on-surface-variant font-sans">
          Gestión automatizada de inventario de reactivos, control de vidriería, bitácora
          de equipos y préstamos.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary">Iniciar Sesión</Button>
          <Button variant="outline">Ver Catálogo</Button>
        </div>
      </header>
    </div>
  )
}

export default App
