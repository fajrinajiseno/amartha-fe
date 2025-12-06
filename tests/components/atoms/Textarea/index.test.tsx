import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from '@/components/atoms/Textarea'

describe('Component -> Atom -> Textarea', () => {
  it('renders with initial value', () => {
    render(<Textarea value="note" onChange={() => {}} />)

    const textarea = screen.getByDisplayValue('note') as HTMLTextAreaElement
    expect(textarea).toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const handleChange = jest.fn()
    render(<Textarea value="" onChange={handleChange} />)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'new text' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
