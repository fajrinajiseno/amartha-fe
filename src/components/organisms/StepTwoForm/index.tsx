'use client'

import React from 'react'
import styles from './index.module.scss'
import { searchLocations } from '@/lib/api'
import { Label } from '@/components/atoms/Label'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { Textarea } from '@/components/atoms/Textarea'
import { ErrorText } from '@/components/atoms/ErrorText'
import { AsyncAutocompleteField } from '@/components/molecules/AsyncAutocompleteField'
import type { Step2Data } from '@/types/wizard'

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern']

type Props = {
  data: Step2Data
  errors: { [K in keyof Step2Data]?: string }
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  onPhotoChange: (base64: string | null) => void
  onOfficeLocationChange: (value: string) => void
}

export function StepTwoForm({
  data,
  errors,
  onChange,
  onPhotoChange,
  onOfficeLocationChange
}: Props) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) {
      onPhotoChange(null)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      onPhotoChange(base64)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles['c-step-two']}>
      <div className={styles['c-step-two__group']}>
        <Label htmlFor="photo" className={styles['c-step-two__label']}>
          Photo
        </Label>
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <ErrorText message={errors.photoBase64} />

        {data.photoBase64 && (
          <div className={styles['c-step-two__photo-preview']}>
            <img
              src={data.photoBase64}
              alt="Preview"
              className={styles['c-step-two__photo-image']}
            />
          </div>
        )}
      </div>

      <div className={styles['c-step-two__group']}>
        <Label htmlFor="employmentType" className={styles['c-step-two__label']}>
          Employment Type
        </Label>
        <Select
          id="employmentType"
          name="employmentType"
          value={data.employmentType}
          onChange={onChange}
          hasError={Boolean(errors.employmentType)}
        >
          <option value="">Select employment type</option>
          {EMPLOYMENT_TYPES.map((et) => (
            <option key={et} value={et}>
              {et}
            </option>
          ))}
        </Select>
        <ErrorText message={errors.employmentType} />
      </div>

      <AsyncAutocompleteField
        label="Office Location"
        name="officeLocation"
        value={data.officeLocation}
        search={searchLocations}
        onSelect={onOfficeLocationChange}
        placeholder="Type to search location..."
        error={errors.officeLocation}
      />

      <div className={styles['c-step-two__group']}>
        <Label htmlFor="notes" className={styles['c-step-two__label']}>
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={data.notes}
          onChange={onChange}
          placeholder="Additional notes..."
          hasError={Boolean(errors.notes)}
        />
        <ErrorText message={errors.notes} />
      </div>
    </div>
  )
}
