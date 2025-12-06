import React from 'react'
import styles from './index.module.scss'
import { Label } from '@/components/atoms/Label'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { ErrorText } from '@/components/atoms/ErrorText'

type Props = {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  type?: 'text' | 'email'
  placeholder?: string
  options?: string[]
  error?: string
  helperText?: string
  readOnly?: boolean
  disabled?: boolean
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  options,
  error,
  helperText,
  readOnly,
  disabled
}: Props) {
  const hasError = Boolean(error)

  return (
    <div className={styles['c-form-field']}>
      <Label htmlFor={name} className={styles['c-form-field__label']}>
        {label}
      </Label>

      <div className={styles['c-form-field__control']}>
        {options ? (
          <Select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            hasError={hasError}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            hasError={hasError}
            readOnly={readOnly}
            disabled={disabled}
          />
        )}
      </div>

      {helperText && (
        <p className={styles['c-form-field__helper']}>{helperText}</p>
      )}

      <ErrorText message={error} />
    </div>
  )
}
