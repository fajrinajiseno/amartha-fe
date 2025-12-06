import '@testing-library/jest-dom'

jest.setTimeout(60000)

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub'
  }
}))

jest.spyOn(console, 'error').mockImplementation(() => {})
