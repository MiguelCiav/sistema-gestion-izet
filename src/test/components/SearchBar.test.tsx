import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../../components/ui/SearchBar'

describe('SearchBar Component', () => {
  it('renders search input and responds to user typing', () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} placeholder="Buscar reactivos..." />)
    const input = screen.getByPlaceholderText('Buscar reactivos...')
    fireEvent.change(input, { target: { value: 'Acetona' } })
    expect(handleChange).toHaveBeenCalledWith('Acetona')
  })

  it('renders filter button and triggers onFilterClick', () => {
    const handleFilter = vi.fn()
    render(<SearchBar value="" onChange={() => {}} onFilterClick={handleFilter} />)
    const filterBtn = screen.getByLabelText('Filtrar resultados')
    fireEvent.click(filterBtn)
    expect(handleFilter).toHaveBeenCalledTimes(1)
  })

  it('highlights filter button when isFilterActive is true', () => {
    render(<SearchBar value="" onChange={() => {}} onFilterClick={() => {}} isFilterActive />)
    const filterBtn = screen.getByLabelText('Filtrar resultados')
    expect(filterBtn).toHaveClass('bg-primary')
  })
})
