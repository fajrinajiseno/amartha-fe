'use client'

import React from 'react'
import styles from './index.module.scss'
import { FormField } from '@/components/molecules/FormField'
import { searchDepartments } from '@/lib/api'
import { AsyncAutocompleteField } from '@/components/molecules/AsyncAutocompleteField'
import type { Step1Data } from '@/types/wizard'

const ROLES = ['ops', 'admin', 'engineer', 'finance']

type Props = {
  data: Step1Data
  errors: { [K in keyof Step1Data]?: string }
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onDepartmentChange: (departmentName: string) => void
}

export function StepOneForm({
  data,
  errors,
  onChange,
  onDepartmentChange
}: Props) {
  return (
    <div className={styles['step-one']}>
      <FormField
        label="Full Name"
        name="fullName"
        value={data.fullName}
        onChange={onChange}
        placeholder="John Doe"
        error={errors.fullName}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={data.email}
        onChange={onChange}
        placeholder="john.doe@example.com"
        error={errors.email}
      />

      <AsyncAutocompleteField
        label="Department"
        name="department"
        value={data.department}
        search={searchDepartments}
        onSelect={onDepartmentChange}
        placeholder="Type to search department..."
        error={errors.department}
      />

      <FormField
        label="Role"
        name="role"
        value={data.role}
        onChange={onChange}
        options={ROLES}
        error={errors.role}
      />

      <FormField
        label="Employee ID"
        name="employeeId"
        value={data.employeeId}
        onChange={onChange}
        placeholder="ENG-003"
        error={errors.employeeId}
        helperText="Format: 3-letter dept code + '-' + 3-digit seq (e.g. ENG-003)"
        readOnly={true}
      />
    </div>
  )
}
