import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TopBar } from '../../components/ui/TopBar'

describe('TopBar Component', () => {
  it('renders branding and current lab', () => {
    render(<TopBar currentLab="LEPA" />)
    expect(screen.getByText('Terra Lab')).toBeInTheDocument()
    expect(screen.getByText('LEPA')).toBeInTheDocument()
  })

  it('allows switching labs when onSwitchLab is provided', () => {
    const handleSwitch = vi.fn()
    render(<TopBar currentLab="LEPA" onSwitchLab={handleSwitch} />)
    const lemBtn = screen.getByRole('button', { name: 'LEM' })
    fireEvent.click(lemBtn)
    expect(handleSwitch).toHaveBeenCalledWith('LEM')
  })

  it('triggers onSettingsClick when settings button is clicked', () => {
    const handleSettings = vi.fn()
    render(<TopBar currentLab="LEPA" onSettingsClick={handleSettings} />)
    const settingsBtn = screen.getByLabelText('Configuración')
    fireEvent.click(settingsBtn)
    expect(handleSettings).toHaveBeenCalledTimes(1)
  })
})
