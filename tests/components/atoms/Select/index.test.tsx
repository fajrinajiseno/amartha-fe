import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '@/components/atoms/Select'

describe('Component -> Atom -> Select', () => {
  it('renders options and selected value', () => {
    render(
      <Select value="b" onChange={() => {}}>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>
    )

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('b')
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  it('fires onChange when value changes', () => {
    const handleChange = jest.fn()
    render(
      <Select value="a" onChange={handleChange}>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>
    )

    const select = screen.getByRole('combobox') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'b' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
