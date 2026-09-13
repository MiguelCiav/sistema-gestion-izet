import React from 'react'

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
          <button
            type="button"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0"
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className="rounded-xl border border-outline px-5 py-2.5 text-sm font-semibold text-on-surface transition-all duration-200 hover:bg-surface-container-high active:translate-y-0"
          >
            Ver Catálogo
          </button>
        </div>
      </header>
    </div>
  )
}

export default App
