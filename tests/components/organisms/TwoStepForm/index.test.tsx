import { render, screen, fireEvent, act } from '@testing-library/react'
import { TwoStepForm } from '@/components/organisms/TwoStepForm'
import getBasicInfo from '../../../__mocks__/getBasicInfo.json'
import searchDepartments from '../../../__mocks__/searchDepartments.json'
import searchLocations from '../../../__mocks__/searchLocations.json'

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

const getBasicInfoMock = jest.fn()
const searchDepartmentsMock = jest.fn()
const searchLocationsMock = jest.fn()
const submitBasicInfoMock = jest.fn()
const submitDetailsMock = jest.fn()

jest.mock('@/lib/api', () => ({
  getBasicInfo: (...args: any[]) => getBasicInfoMock(...args),
  searchDepartments: (...args: any[]) => searchDepartmentsMock(...args),
  searchLocations: (...args: any[]) => searchLocationsMock(...args),
  submitBasicInfo: (...args: any[]) => submitBasicInfoMock(...args),
  submitDetails: (...args: any[]) => submitDetailsMock(...args)
}))

function setupFileReaderMock() {
  const FILE_BASE64 = 'data:image/png;base64,TEST_BASE64_STRING'

  const fileReaderMock = {
    readAsDataURL: jest.fn(function (this: FileReader, _file: Blob) {
      if (typeof this.onloadend === 'function') {
        this.onloadend({} as any)
      }
    }),
    result: FILE_BASE64
  }

  // @ts-ignore override global
  global.FileReader = jest
    .fn()
    .mockImplementation(() => fileReaderMock as unknown as FileReader)

  return {
    fileReaderMock,
    FILE_BASE64
  }
}

describe('Component -> Organisms -> TwoStepForm', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    submitBasicInfoMock.mockReset()
    submitDetailsMock.mockReset()
    pushMock.mockReset()

    jest
      .spyOn(window.localStorage.__proto__, 'setItem')
      .mockImplementation(() => {})
    jest
      .spyOn(window.localStorage.__proto__, 'removeItem')
      .mockImplementation(() => {})
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null)
  })

  afterEach(() => {
    jest.useRealTimers()
    ;(window.localStorage.setItem as any).mockRestore?.()
    ;(window.localStorage.removeItem as any).mockRestore?.()
    ;(window.localStorage.getItem as any).mockRestore?.()
  })

  it('admin: submits basicInfo with step1 data and details with step2', async () => {
    const { FILE_BASE64 } = setupFileReaderMock()

    getBasicInfoMock.mockResolvedValueOnce({ data: getBasicInfo })
    searchDepartmentsMock.mockResolvedValueOnce({ data: searchDepartments })
    searchLocationsMock.mockResolvedValueOnce({ data: searchLocations })
    render(<TwoStepForm mode="admin" />)

    const fullName = screen.getByLabelText('Full Name') as HTMLInputElement
    const email = screen.getByLabelText('Email') as HTMLInputElement
    const department = screen.getByLabelText('Department') as HTMLInputElement
    const role = screen.getByLabelText('Role') as HTMLSelectElement

    fireEvent.change(fullName, { target: { value: 'Admin User' } })
    fireEvent.change(email, { target: { value: 'admin@example.com' } })
    fireEvent.change(department, { target: { value: 'Engineering' } })
    await act(async () => {
      jest.advanceTimersByTime(300)
    })
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('autocomplete-department-4'))
    })
    expect(searchDepartmentsMock).toHaveBeenCalledWith({
      name_like: 'Engineering'
    })
    fireEvent.change(role, { target: { value: 'admin' } })

    const nextBtn = screen.getByText('Next')

    await act(async () => {
      fireEvent.click(nextBtn)
    })

    const fileInput = screen.getByLabelText('Photo') as HTMLInputElement
    const file = new File(['dummy-image-content'], 'avatar.png', {
      type: 'image/png'
    })
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })
    const employmentType = screen.getByLabelText(
      'Employment Type'
    ) as HTMLSelectElement
    const locationInput = screen.getByLabelText(
      'Office Location'
    ) as HTMLInputElement
    const notesInput = screen.getByLabelText('Notes') as HTMLTextAreaElement

    fireEvent.change(employmentType, {
      target: { value: 'Full-time' }
    })
    fireEvent.change(locationInput, {
      target: { value: 'Jakarta' }
    })
    await act(async () => {
      jest.advanceTimersByTime(300)
    })
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('autocomplete-officeLocation-1'))
    })
    expect(searchLocationsMock).toHaveBeenCalledWith({
      name_like: 'Jakarta'
    })
    fireEvent.change(notesInput, {
      target: { value: 'notes Engineering' }
    })

    const submitBtn = screen.getByText('Submit')

    await act(async () => {
      fireEvent.click(submitBtn)
      expect(
        await screen.findByTestId('two-step-form-progress')
      ).toHaveAttribute('style', 'width: 25%;')
      expect(
        await screen.findByTestId('two-step-form-progress-stage')
      ).toHaveTextContent('⏳ Submitting basicInfo…')
    })

    await act(async () => {
      jest.advanceTimersByTime(3000)
    })

    expect(screen.getByTestId('two-step-form-progress')).toHaveAttribute(
      'style',
      'width: 75%;'
    )
    expect(
      await screen.findByTestId('two-step-form-progress-stage')
    ).toHaveTextContent('⏳ Submitting details…')

    await act(async () => {
      jest.advanceTimersByTime(3000)
    })

    expect(submitBasicInfoMock).toHaveBeenCalledWith({
      department: 'Engineering',
      email: 'admin@example.com',
      employeeId: 'ENG-003',
      fullName: 'Admin User',
      role: 'admin'
    })
    expect(submitDetailsMock).toHaveBeenCalledWith({
      employmentType: 'Full-time',
      notes: 'notes Engineering',
      officeLocation: 'Jakarta',
      photoBase64: FILE_BASE64,
      employeeId: 'ENG-003'
    })
    expect(pushMock).toHaveBeenCalledWith('/employees')
  })

  it('admin: submits basicInfo with step1 data but error', async () => {
    setupFileReaderMock()

    getBasicInfoMock.mockResolvedValueOnce({ data: getBasicInfo })
    searchDepartmentsMock.mockResolvedValueOnce({ data: searchDepartments })
    searchLocationsMock.mockResolvedValueOnce({ data: searchLocations })
    submitBasicInfoMock.mockRejectedValueOnce(
      new Error('error submit basic info')
    )
    render(<TwoStepForm mode="admin" />)

    const fullName = screen.getByLabelText('Full Name') as HTMLInputElement
    const email = screen.getByLabelText('Email') as HTMLInputElement
    const department = screen.getByLabelText('Department') as HTMLInputElement
    const role = screen.getByLabelText('Role') as HTMLSelectElement

    fireEvent.change(fullName, { target: { value: 'Admin User' } })
    fireEvent.change(email, { target: { value: 'admin@example.com' } })
    fireEvent.change(department, { target: { value: 'Engineering' } })
    await act(async () => {
      jest.advanceTimersByTime(300)
    })
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('autocomplete-department-4'))
    })
    expect(searchDepartmentsMock).toHaveBeenCalledWith({
      name_like: 'Engineering'
    })
    fireEvent.change(role, { target: { value: 'admin' } })

    const nextBtn = screen.getByText('Next')

    await act(async () => {
      fireEvent.click(nextBtn)
    })

    const fileInput = screen.getByLabelText('Photo') as HTMLInputElement
    const file = new File(['dummy-image-content'], 'avatar.png', {
      type: 'image/png'
    })
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })
    const employmentType = screen.getByLabelText(
      'Employment Type'
    ) as HTMLSelectElement
    const locationInput = screen.getByLabelText(
      'Office Location'
    ) as HTMLInputElement
    const notesInput = screen.getByLabelText('Notes') as HTMLTextAreaElement

    fireEvent.change(employmentType, {
      target: { value: 'Full-time' }
    })
    fireEvent.change(locationInput, {
      target: { value: 'Jakarta' }
    })
    await act(async () => {
      jest.advanceTimersByTime(300)
    })
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('autocomplete-officeLocation-1'))
    })
    expect(searchLocationsMock).toHaveBeenCalledWith({
      name_like: 'Jakarta'
    })
    fireEvent.change(notesInput, {
      target: { value: 'notes Engineering' }
    })

    const submitBtn = screen.getByText('Submit')

    await act(async () => {
      fireEvent.click(submitBtn)
    })

    await act(async () => {
      jest.advanceTimersByTime(3000)
    })

    expect(submitBasicInfoMock).toHaveBeenCalledWith({
      department: 'Engineering',
      email: 'admin@example.com',
      employeeId: 'ENG-003',
      fullName: 'Admin User',
      role: 'admin'
    })
    expect(submitDetailsMock).toHaveBeenCalledTimes(0)
    expect(pushMock).toHaveBeenCalledTimes(0)
    const toast = await screen.findByTestId('two-step-form-toast')
    expect(toast).toHaveTextContent(
      'Failed to submit employee data. Please try again.'
    )
  })

  it('ops: still calls submitBasicInfo with empty step1 and details with step2', async () => {
    searchLocationsMock.mockResolvedValueOnce({ data: searchLocations })
    render(<TwoStepForm mode="ops" />)

    const employmentType = screen.getByLabelText(
      'Employment Type'
    ) as HTMLSelectElement
    const locationInput = screen.getByLabelText(
      'Office Location'
    ) as HTMLInputElement

    fireEvent.change(employmentType, {
      target: { value: 'Full-time' }
    })
    fireEvent.change(locationInput, {
      target: { value: 'Jakarta' }
    })
    await act(async () => {
      jest.advanceTimersByTime(300)
    })
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('autocomplete-officeLocation-1'))
    })
    expect(searchLocationsMock).toHaveBeenCalledWith({
      name_like: 'Jakarta'
    })

    const submitBtn = screen.getByText('Submit')

    await act(async () => {
      fireEvent.click(submitBtn)
    })

    await act(async () => {
      jest.advanceTimersByTime(3000)
    })
    await act(async () => {
      jest.advanceTimersByTime(3000)
    })

    expect(submitBasicInfoMock).toHaveBeenCalledWith({
      department: '',
      email: '',
      employeeId: '',
      fullName: '',
      role: ''
    })
    expect(submitDetailsMock).toHaveBeenCalledWith({
      employmentType: 'Full-time',
      notes: '',
      officeLocation: 'Jakarta',
      photoBase64: null
    })
    expect(pushMock).toHaveBeenCalledWith('/employees')
  })
})
