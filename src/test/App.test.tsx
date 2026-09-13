import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders the system header and title', () => {
    render(<App />)
    expect(screen.getByText('Sistema LEPA-LEM')).toBeInTheDocument()
    expect(screen.getByText('IZT • UCV')).toBeInTheDocument()
  })

  it('renders call to action buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ver catálogo/i })).toBeInTheDocument()
  })
})
