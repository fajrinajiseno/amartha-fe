'use client'

import { useState } from 'react'
import '../globals.scss'
import styles from './index.module.scss'

import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { Textarea } from '@/components/atoms/Textarea'
import { FormField } from '@/components/molecules/FormField'
import { AsyncAutocompleteField } from '@/components/molecules/AsyncAutocompleteField'
import { Response, SearchOption } from '@/lib/api'

const MOCK_DEPARTMENTS: SearchOption[] = [
  { id: 1, name: 'Lending' },
  { id: 2, name: 'Funding' },
  { id: 3, name: 'Operations' },
  { id: 4, name: 'Engineering' }
]

async function mockSearchDepartments(
  params: Record<string, string>
): Promise<Response<SearchOption>> {
  if (!params.name_like) return { data: [] }
  const lower = params.name_like.toLowerCase()
  await new Promise((r) => setTimeout(r, 200))
  return {
    data: MOCK_DEPARTMENTS.filter((d) => d.name.toLowerCase().includes(lower))
  }
}

export default function StyleguidePage() {
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [fieldValue, setFieldValue] = useState('')
  const [deptValue, setDeptValue] = useState('')

  return (
    <div className={styles['p-styleguide']}>
      <div className={styles['p-styleguide__card']}>
        <h1 className={styles['p-styleguide__title']}>UI Styleguide</h1>
        <p className={styles['p-styleguide__subtitle']}>
          Quick preview of atoms & molecules used in the Employee Registration
          form.
        </p>

        {/* Buttons */}
        <section className={styles['p-styleguide__section']}>
          <h2 className={styles['p-styleguide__section-title']}>Buttons</h2>
          <div className={styles['p-styleguide__row']}>
            <Button variant="primary">Primary button</Button>
            <Button variant="secondary">Secondary button</Button>
          </div>
        </section>

        {/* Inputs */}
        <section className={styles['p-styleguide__section']}>
          <h2 className={styles['p-styleguide__section-title']}>Inputs</h2>
          <div className={styles['p-styleguide__column']}>
            <Input
              placeholder="Regular input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input placeholder="Input with error" hasError />
          </div>
        </section>

        {/* Select & Textarea */}
        <section className={styles['p-styleguide__section']}>
          <h2 className={styles['p-styleguide__section-title']}>
            Select & Textarea
          </h2>
          <div className={styles['p-styleguide__column']}>
            <Select
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            >
              <option value="">Choose</option>
              <option value="one">Option one</option>
              <option value="two">Option two</option>
            </Select>

            <Textarea
              placeholder="Textarea example"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>
        </section>

        {/* FormField */}
        <section className={styles['p-styleguide__section']}>
          <h2 className={styles['p-styleguide__section-title']}>FormField</h2>
          <FormField
            label="Full Name"
            name="fullNameGuide"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            placeholder="John Doe"
            helperText="This is a helper text."
          />
          <FormField
            label="Email (error state)"
            name="emailGuide"
            value=""
            onChange={() => {}}
            placeholder="email@example.com"
            error="Invalid email format"
          />
        </section>

        {/* Async Autocomplete (mock) */}
        <section className={styles['p-styleguide__section']}>
          <h2 className={styles['p-styleguide__section-title']}>
            AsyncAutocompleteField
          </h2>
          <AsyncAutocompleteField
            label="Department (mocked)"
            name="departmentGuide"
            value={deptValue}
            search={mockSearchDepartments}
            onSelect={setDeptValue}
            placeholder="Type to search department..."
          />
        </section>
      </div>
    </div>
  )
}
