export type BasicInfo = {
  id: number
  fullName: string
  email: string
  department: string
  role: string
  employeeId: string
}

export type Details = {
  id: number
  photoBase64: string
  employmentType: string
  officeLocation: string
  notes: string
  employeeId?: string
}

export type EmployeeRow = {
  id: number
  name: string
  department: string
  role: string
  location: string
  photoBase64?: string | null
}
