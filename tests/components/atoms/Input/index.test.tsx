import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/atoms/Input'

describe('Component -> Atom -> Input', () => {
  it('renders with passed value', () => {
    render(<Input value="Hello" onChange={() => {}} />)

    const input = screen.getByDisplayValue('Hello') as HTMLInputElement
    expect(input).toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const handleChange = jest.fn()
    render(<Input value="" onChange={handleChange} />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'abc' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('applies error class when hasError is true', () => {
    render(<Input value="" onChange={() => {}} hasError />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('c-input--error')
  })

  it('applies disabled class and disables input', () => {
    render(<Input value="" onChange={() => {}} disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('c-input--disabled')
  })
})
