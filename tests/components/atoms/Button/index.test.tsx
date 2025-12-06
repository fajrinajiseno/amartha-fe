import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/atoms/Button'

describe('Component -> Atom -> Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>)

    const btn = screen.getByRole('button', { name: 'Primary' })
    expect(btn).toHaveClass('c-button--primary')
  })

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary</Button>)

    const btn = screen.getByRole('button', { name: 'Secondary' })
    expect(btn).toHaveClass('c-button--secondary')
  })

  it('is disabled when disabled prop is true', () => {
    const onClick = jest.fn()
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    )

    const btn = screen.getByRole('button', { name: 'Disabled' })
    expect(btn).toBeDisabled()
    expect(btn).toHaveClass('c-button--disabled')

    fireEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })
})
