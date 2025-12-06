import { render, screen } from '@testing-library/react'
import { Label } from '@/components/atoms/Label'

describe('Component -> Atom -> Label', () => {
  it('renders children and htmlFor', () => {
    render(<Label htmlFor="fullName">Full Name</Label>)

    const label = screen.getByText('Full Name') as HTMLLabelElement
    expect(label).toBeInTheDocument()
    expect(label.htmlFor).toBe('fullName')
  })
})
