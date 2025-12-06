import { render, screen } from '@testing-library/react'
import { ErrorText } from '@/components/atoms/ErrorText'

describe('Component -> Atom -> ErrorText', () => {
  it('renders message when provided', () => {
    render(<ErrorText message="This field is required" />)

    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('renders nothing when message is empty/undefined', () => {
    const { container, rerender } = render(<ErrorText message={undefined} />)
    expect(container).toBeEmptyDOMElement()

    rerender(<ErrorText message="" />)
    expect(container).toBeEmptyDOMElement()
  })
})
