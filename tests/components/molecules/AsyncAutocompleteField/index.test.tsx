import { render, screen, fireEvent, act } from '@testing-library/react'
import {
  AsyncAutocompleteField,
  Option
} from '@/components/molecules/AsyncAutocompleteField'

describe('Component -> Molecules -> AsyncAutocompleteField', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('debounces search calls', async () => {
    const options: Option[] = [{ id: 1, name: 'Engineering' }]
    const search = jest.fn().mockResolvedValue(options)
    const onSelect = jest.fn()

    render(
      <AsyncAutocompleteField
        label="Department"
        name="department"
        value=""
        search={search}
        onSelect={onSelect}
        placeholder="Type department"
      />
    )

    const input = screen.getByPlaceholderText('Type department')

    fireEvent.change(input, { target: { value: 'E' } })
    fireEvent.change(input, { target: { value: 'En' } })
    fireEvent.change(input, { target: { value: 'Eng' } })

    expect(search).not.toHaveBeenCalled()

    await act(async () => {
      jest.advanceTimersByTime(300)
    })

    expect(search).toHaveBeenCalledTimes(1)
    expect(search).toHaveBeenCalledWith({ name_like: 'Eng' })
  })

  it('calls onSelect only when an option is clicked', async () => {
    const options: Option[] = [{ id: 1, name: 'Engineering' }]
    const search = jest.fn().mockResolvedValue(options)
    const onSelect = jest.fn()

    render(
      <AsyncAutocompleteField
        label="Department"
        name="department"
        value=""
        search={search}
        onSelect={onSelect}
        placeholder="Type department"
      />
    )

    const input = screen.getByLabelText('Department') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'Eng' } })

    await act(async () => {
      jest.advanceTimersByTime(300)
    })

    const option = await screen.findByText('Engineering')

    expect(onSelect).not.toHaveBeenCalled()

    await act(async () => {
      fireEvent.mouseDown(option)
    })

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('Engineering')
  })

  it('reverts to last valid value on blur when string not matched', async () => {
    const options: Option[] = [{ id: 1, name: 'Engineering' }]
    const search = jest.fn().mockResolvedValue(options)
    const onSelect = jest.fn()

    render(
      <AsyncAutocompleteField
        label="Department"
        name="department"
        value="Engineering"
        search={search}
        onSelect={onSelect}
        placeholder="Type department"
      />
    )

    const input = screen.getByLabelText('Department') as HTMLInputElement

    expect(input.value).toBe('Engineering')

    fireEvent.change(input, { target: { value: 'EngX' } })
    expect(input.value).toBe('EngX')

    await act(async () => {
      fireEvent.blur(input)
      jest.advanceTimersByTime(300)
    })

    expect(input.value).toBe('Engineering')
  })
})
