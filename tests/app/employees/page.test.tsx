import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmployeesPage from '@/app/employees/page'

const getBasicInfoMock = jest.fn()
const getDetailsMock = jest.fn()

jest.mock('@/lib/api', () => ({
  getBasicInfo: (...args: any[]) => getBasicInfoMock(...args),
  getDetails: (...args: any[]) => getDetailsMock(...args)
}))

const pushMock = jest.fn()

jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation')
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
      prefetch: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn()
    }),
    useSearchParams: () => {
      // defaults page=1, limit=10
      return new URLSearchParams('')
    }
  }
})

describe('App -> Employees', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches employees, merges them and renders the table', async () => {
    getBasicInfoMock.mockResolvedValue({
      data: [
        {
          id: 1,
          employeeId: 'ENG-001',
          fullName: 'test name',
          department: 'Engineering',
          role: 'engineer',
          email: 'test1@gmail.com'
        },
        {
          id: 2,
          employeeId: 'ENG-002',
          fullName: 'test name 2',
          department: 'Lending',
          role: 'ops',
          email: 'test2@gmail.com'
        },
        {
          id: 3,
          employeeId: '',
          fullName: '',
          department: '',
          role: '',
          email: ''
        }
      ]
    })

    getDetailsMock.mockResolvedValue({
      data: [
        {
          id: 1,
          employeeId: 'ENG-001',
          officeLocation: 'Jakarta',
          photoBase64: 'data:image/png;base64,AAA',
          employmentType: 'Full-time',
          notes: 'test notes'
        },
        {
          id: 2,
          employeeId: 'ENG-002',
          officeLocation: 'Surabaya',
          photoBase64: 'data:image/png;base64,BBB',
          employmentType: 'Part-time',
          notes: 'test notes 2'
        },
        {
          id: 3,
          officeLocation: 'Depok',
          photoBase64: 'data:image/png;base64,CCC',
          employmentType: 'Contract',
          notes: 'test notes 3'
        }
      ],
      total: 2
    })

    render(<EmployeesPage />)

    expect(
      await screen.findByTestId('employees-table-1-name')
    ).toHaveTextContent('test name')
    expect(screen.getByTestId('employees-table-2-name')).toHaveTextContent(
      'test name 2'
    )
    expect(screen.getByTestId('employees-table-3-name')).toHaveTextContent('-')

    expect(
      await screen.findByTestId('employees-table-1-department')
    ).toHaveTextContent('Engineering')
    expect(
      screen.getByTestId('employees-table-2-department')
    ).toHaveTextContent('Lending')
    expect(
      screen.getByTestId('employees-table-3-department')
    ).toHaveTextContent('-')

    expect(
      await screen.findByTestId('employees-table-1-avatar')
    ).toHaveAttribute('src', 'data:image/png;base64,AAA')
    expect(screen.getByTestId('employees-table-2-avatar')).toHaveAttribute(
      'src',
      'data:image/png;base64,BBB'
    )
    expect(screen.getByTestId('employees-table-3-avatar')).toHaveAttribute(
      'src',
      'data:image/png;base64,CCC'
    )

    expect(
      await screen.findByTestId('employees-table-1-role')
    ).toHaveTextContent('engineer')
    expect(screen.getByTestId('employees-table-2-role')).toHaveTextContent(
      'ops'
    )
    expect(screen.getByTestId('employees-table-3-role')).toHaveTextContent('-')

    expect(
      await screen.findByTestId('employees-table-1-location')
    ).toHaveTextContent('Jakarta')
    expect(screen.getByTestId('employees-table-2-location')).toHaveTextContent(
      'Surabaya'
    )
    expect(screen.getByTestId('employees-table-3-location')).toHaveTextContent(
      'Depok'
    )

    expect(getBasicInfoMock).toHaveBeenCalledWith({
      _page: '1',
      _limit: '10'
    })
    expect(getDetailsMock).toHaveBeenCalledWith({
      _page: '1',
      _limit: '10'
    })
  })

  it('navigates to the next page when Next is clicked', async () => {
    getBasicInfoMock.mockResolvedValue({
      data: [
        {
          employeeId: 'ENG-001',
          fullName: 'fajrin',
          department: 'Engineering',
          role: 'engineer'
        }
      ]
    })

    getDetailsMock.mockResolvedValue({
      data: [
        {
          id: 1,
          employeeId: 'ENG-001',
          officeLocation: 'Jakarta',
          photoBase64: 'data:image/png;base64,AAA'
        }
      ],
      total: 20 // enough so hasNext = true
    })

    render(<EmployeesPage />)

    // ensure initial data loaded
    await screen.findByText('fajrin')

    const user = userEvent.setup()
    const prevButton = screen.getByTestId('pagination-footer-prev')
    const nextButton = screen.getByTestId('pagination-footer-next')

    expect(prevButton).toHaveAttribute('disabled')

    await user.click(nextButton)

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledTimes(1)
    })

    const url = pushMock.mock.calls[0][0] as string
    expect(url).toContain('/employees?')
    expect(url).toContain('page=2')
    expect(url).toContain('limit=10')
  })

  it('shows error message when API fails', async () => {
    getBasicInfoMock.mockResolvedValue({
      data: []
    })

    getDetailsMock.mockRejectedValue(new Error('Failed to load employees'))

    render(<EmployeesPage />)

    expect(await screen.findByTestId('employees-page-error')).toHaveTextContent(
      'Failed to load employees'
    )
  })

  it('shows empty message when API return empty', async () => {
    getBasicInfoMock.mockResolvedValue({
      data: []
    })
    getDetailsMock.mockResolvedValue({
      data: [],
      total: 0
    })

    render(<EmployeesPage />)

    expect(
      await screen.findByTestId('employees-table-empty')
    ).toHaveTextContent('No employees found')
  })
})
