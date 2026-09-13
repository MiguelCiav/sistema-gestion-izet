import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../../components/ui/Modal'

describe('Modal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Título Modal">
        Contenido
      </Modal>
    )
    expect(screen.queryByText('Título Modal')).not.toBeInTheDocument()
  })

  it('renders title, description, content and footer when isOpen is true', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Registrar Consumo"
        description="Seleccione la cantidad a descontar"
        footer={<button>Aceptar</button>}
      >
        <p>Formulario de consumo</p>
      </Modal>
    )

    expect(screen.getByText('Registrar Consumo')).toBeInTheDocument()
    expect(screen.getByText('Seleccione la cantidad a descontar')).toBeInTheDocument()
    expect(screen.getByText('Formulario de consumo')).toBeInTheDocument()
    expect(screen.getByText('Aceptar')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal">
        Contenido
      </Modal>
    )
    const closeBtn = screen.getByLabelText('Cerrar modal')
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} title="Modal">
        Contenido
      </Modal>
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
