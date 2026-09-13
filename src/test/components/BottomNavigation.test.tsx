import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BottomNavigation } from '../../components/ui/BottomNavigation'

describe('BottomNavigation Component', () => {
  it('renders all four primary navigation tabs', () => {
    render(<BottomNavigation activeTab="inventario" onTabChange={() => {}} />)
    expect(screen.getByText('Inventario')).toBeInTheDocument()
    expect(screen.getByText('Bitácora')).toBeInTheDocument()
    expect(screen.getByText('Préstamos')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('indicates active tab with aria-current="page"', () => {
    render(<BottomNavigation activeTab="dashboard" onTabChange={() => {}} />)
    const dashboardBtn = screen.getByRole('button', { name: /dashboard/i })
    expect(dashboardBtn).toHaveAttribute('aria-current', 'page')
  })

  it('triggers onTabChange when a tab is clicked', () => {
    const handleTabChange = vi.fn()
    render(<BottomNavigation activeTab="inventario" onTabChange={handleTabChange} />)
    const prestamosBtn = screen.getByRole('button', { name: /préstamos/i })
    fireEvent.click(prestamosBtn)
    expect(handleTabChange).toHaveBeenCalledWith('prestamos')
  })
})
