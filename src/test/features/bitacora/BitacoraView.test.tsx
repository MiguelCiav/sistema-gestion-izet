import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BitacoraView } from '../../../features/bitacora'
import { AuthProvider } from '../../../features/auth'
import { LabProvider } from '../../../features/laboratorios'

describe('BitacoraView Component (HU06)', () => {
  const renderView = (onNavigate = vi.fn()) => {
    return render(
      <AuthProvider>
        <LabProvider>
          <BitacoraView onNavigate={onNavigate} />
        </LabProvider>
      </AuthProvider>
    )
  }

  it('renders title and structure matching BITÁCORA.png wireframe', async () => {
    renderView()

    expect(screen.getByRole('heading', { level: 1, name: 'Bitácora' })).toBeInTheDocument()
    expect(screen.getByText(/Movimientos en/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/Buscar por reactivo, código o responsable/i)
    ).toBeInTheDocument()

    // Should render movement cards from fallback seed
    expect(await screen.findByText(/Consumo de Ácido Clorhídrico 37%/i)).toBeInTheDocument()
    expect(screen.getByText(/Consumo de Etanol Absoluto 99.8%/i)).toBeInTheDocument()
  })

  it('opens and closes filter chips options', async () => {
    renderView()

    const filterToggleBtn = screen.getByLabelText('Filtros de bitácora')
    fireEvent.click(filterToggleBtn)

    expect(screen.getByRole('button', { name: /filtrar por consumos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtrar por ingresos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtrar por ajustes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtrar por préstamos/i })).toBeInTheDocument()
  })

  it('filters by movement type when clicking filter chip', async () => {
    renderView()

    // Open filters
    const filterToggleBtn = screen.getByLabelText('Filtros de bitácora')
    fireEvent.click(filterToggleBtn)

    // Click on 'Ingresos'
    const ingresosChip = screen.getByRole('button', { name: /filtrar por ingresos/i })
    fireEvent.click(ingresosChip)

    await waitFor(() => {
      expect(screen.getByText(/Ingreso de Ácido Clorhídrico 37%/i)).toBeInTheDocument()
      expect(screen.queryByText(/Consumo de Etanol Absoluto/i)).not.toBeInTheDocument()
    })
  })

  it('opens BitacoraDetailModal when clicking on a movement card', async () => {
    renderView()

    const card = await screen.findByText(/Consumo de Ácido Clorhídrico 37%/i)
    fireEvent.click(card)

    expect(await screen.findByText('Registro de Bitácora')).toBeInTheDocument()
    expect(
      screen.getByText('Historial inmutable de auditoría institucional (Solo Lectura)')
    ).toBeInTheDocument()
    expect(screen.getAllByText('Lic. Elena Morales').length).toBeGreaterThan(0)
    expect(
      screen.getAllByText('Preparación de solución valorada para análisis de aguas').length
    ).toBeGreaterThan(0)

    // Click Volver
    const volverBtn = screen.getByRole('button', { name: /volver a la bitácora/i })
    fireEvent.click(volverBtn)

    await waitFor(() => {
      expect(screen.queryByText('Registro de Bitácora')).not.toBeInTheDocument()
    })
  })
})
