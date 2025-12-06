'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './index.module.scss'
import { submitBasicInfo, submitDetails, getBasicInfo } from '@/lib/api'
import { Button } from '@/components/atoms/Button'
import { StepOneForm } from '@/components/organisms/StepOneForm'
import { StepTwoForm } from '@/components/organisms/StepTwoForm'
import type { Step1Data, Step2Data } from '@/types/wizard'

type Errors = { [key: string]: string | undefined }

const STORAGE_KEY_ADMIN = 'draft_admin'
const STORAGE_KEY_OPS = 'draft_ops'
const AUTO_SAVE_DELAY = 2000

const emptyStep1: Step1Data = {
  fullName: '',
  email: '',
  department: '',
  role: '',
  employeeId: ''
}

const emptyStep2: Step2Data = {
  photoBase64: null,
  employmentType: '',
  officeLocation: '',
  notes: ''
}

function departmentToCode(name: string): string {
  const map: Record<string, string> = {
    Lending: 'LEN',
    Funding: 'FUN',
    Operations: 'OPS',
    Engineering: 'ENG'
  }

  if (map[name]) return map[name]

  return (name || '').replace(/\s+/g, '').slice(0, 3).toUpperCase()
}

type Props = {
  mode: 'admin' | 'ops'
}

export function TwoStepForm({ mode }: Props) {
  // admin: start at step 1; ops: only step 2
  const [step, setStep] = useState<1 | 2>(() => (mode === 'ops' ? 2 : 1))
  const [step1, setStep1] = useState<Step1Data>(emptyStep1)
  const [step2, setStep2] = useState<Step2Data>(emptyStep2)
  const [errorsStep1, setErrorsStep1] = useState<Errors>({})
  const [errorsStep2, setErrorsStep2] = useState<Errors>({})
  const [hydrated, setHydrated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [submitProgress, setSubmitProgress] = useState(0)
  const [submitStage, setSubmitStage] = useState<string | null>(null)

  const router = useRouter()

  const isOpsMode = mode === 'ops'
  const isAdminMode = mode === 'admin'

  const storageKey = isOpsMode ? STORAGE_KEY_OPS : STORAGE_KEY_ADMIN

  // ---------- Restore from localStorage on mount OR mode change ----------
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return

      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          step1?: Step1Data
          step2?: Step2Data
          step?: 1 | 2
        }

        if (parsed.step1) setStep1(parsed.step1)
        if (parsed.step2) setStep2(parsed.step2)

        if (isOpsMode) {
          setStep(2)
        } else if (parsed.step === 1 || parsed.step === 2) {
          setStep(parsed.step)
        } else {
          setStep(1)
        }
      } else {
        setStep1(emptyStep1)
        setStep2(emptyStep2)
        setStep(isOpsMode ? 2 : 1)
      }
    } catch (err) {
      console.error('Failed to restore form from localStorage', err)
    } finally {
      setHydrated(true)
    }
  }, [mode, storageKey, isOpsMode])

  // ---------- Debounced save (2s inactivity) for this mode ----------
  useEffect(() => {
    if (!hydrated) return
    if (typeof window === 'undefined') return

    const timeoutId = window.setTimeout(() => {
      try {
        const payload = { step1, step2, step }
        window.localStorage.setItem(storageKey, JSON.stringify(payload))
      } catch (err) {
        console.error('Failed to save form to localStorage', err)
      }
    }, AUTO_SAVE_DELAY)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [step1, step2, step, hydrated, storageKey])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(id)
  }, [toast])

  // ---------- Validation ----------

  function validateEmail(value: string) {
    if (!value) return 'Email is required'
    const simple = /\S+@\S+\.\S+/
    if (!simple.test(value)) return 'Invalid email format'
    return ''
  }

  function validateEmployeeId(value: string) {
    if (!value) return 'Employee ID is required'
    const pattern = /^[A-Z]{3}-\d{3}$/
    if (!pattern.test(value)) {
      return "Format must be ABC-123 (3 letters + '-' + 3 digits)"
    }
    return ''
  }

  function validateStep1(data: Step1Data): boolean {
    const newErrors: Errors = {}

    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required'

    const emailErr = validateEmail(data.email)
    if (emailErr) newErrors.email = emailErr

    if (!data.department.trim()) newErrors.department = 'Department is required'

    if (!data.role.trim()) newErrors.role = 'Role is required'

    const empErr = validateEmployeeId(data.employeeId)
    if (empErr) newErrors.employeeId = empErr

    setErrorsStep1(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function validateStep2(data: Step2Data): boolean {
    const newErrors: Errors = {}

    if (!data.employmentType.trim())
      newErrors.employmentType = 'Employment type is required'

    if (!data.officeLocation.trim())
      newErrors.officeLocation = 'Office location is required'

    setErrorsStep2(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ---------- Handlers with error clearing ----------

  function handleStep1Change(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target

    setStep1((prev) => ({ ...prev, [name]: value }))

    setErrorsStep1((prev) => {
      if (!prev[name]) return prev
      const { [name]: _, ...rest } = prev
      return rest
    })
  }

  function handleStep2Change(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = e.target

    setStep2((prev) => ({ ...prev, [name]: value }))

    setErrorsStep2((prev) => {
      if (!prev[name]) return prev
      const { [name]: _, ...rest } = prev
      return rest
    })
  }

  async function computeNextEmployeeIdByDepartment(
    departmentName: string
  ): Promise<string> {
    const prefix = departmentToCode(departmentName) || 'EMP'

    try {
      const res = await getBasicInfo({ department: departmentName })

      const existingCount = res.data.length
      const next = existingCount + 1
      const seq = String(next).padStart(3, '0')

      return `${prefix}-${seq}`
    } catch (err) {
      console.error('Failed to compute next employeeId', err)
      return `${prefix}-001`
    }
  }

  function handleDepartmentChange(deptName: string) {
    setStep1((prev) => ({
      ...prev,
      department: deptName
    }))

    setErrorsStep1((prev) => {
      const { department, ...rest } = prev
      return rest
    })

    if (!deptName.trim()) {
      setStep1((prev) => ({ ...prev, employeeId: '' }))
      return
    }

    const currentDept = deptName

    computeNextEmployeeIdByDepartment(currentDept).then((employeeId) => {
      setStep1((prev) => {
        // avoid race: if user changed department again, don't override
        if (prev.department !== currentDept) return prev
        return {
          ...prev,
          employeeId
        }
      })
    })
  }

  function handleOfficeLocationChange(locName: string) {
    setStep2((prev) => ({ ...prev, officeLocation: locName }))

    setErrorsStep2((prev) => {
      const { officeLocation, ...rest } = prev
      return rest
    })
  }

  function handlePhotoChange(base64: string | null) {
    setStep2((prev) => ({ ...prev, photoBase64: base64 }))

    setErrorsStep2((prev) => {
      const { photoBase64, ...rest } = prev
      return rest
    })
  }

  // ---------- Navigation / submit ----------

  function handleNext(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (isOpsMode) {
      setStep(2)
      return
    }

    if (validateStep1(step1)) {
      setStep(2)
    }
  }

  function handleBack(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (isOpsMode) return
    setStep(1)
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    setToast(null)
    setSubmitProgress(0)
    setSubmitStage('Starting submission...')

    try {
      if (isAdminMode) {
        const ok1 = validateStep1(step1)
        const ok2 = validateStep2(step2)
        if (!ok1 || !ok2) {
          if (!ok1) setStep(1)
          setIsSubmitting(false)
          setSubmitProgress(0)
          setSubmitStage(null)
          return
        }
      } else if (isOpsMode) {
        const ok2 = validateStep2(step2)
        if (!ok2) {
          setIsSubmitting(false)
          setSubmitProgress(0)
          setSubmitStage(null)
          return
        }
      } else {
        return
      }

      const basicInfoPayload = isAdminMode ? step1 : emptyStep1

      setSubmitProgress(25)
      setSubmitStage('⏳ Submitting basicInfo…')
      await sleep(3000)
      await submitBasicInfo(basicInfoPayload)
      setSubmitStage('✅ basicInfo saved!')

      setSubmitProgress(50)

      setSubmitProgress(75)
      setSubmitStage('⏳ Submitting details…')
      await sleep(3000)
      await submitDetails({
        ...step2,
        ...(step1.employeeId ? { employeeId: step1.employeeId } : {})
      })
      setSubmitStage('🎉 All data processed successfully!')

      setSubmitProgress(100)
      setSubmitStage('Finished!')

      try {
        window.localStorage.removeItem(storageKey)
      } catch {
        // ignore
      }

      router.push('/employees')
    } catch (err) {
      console.error('Submit failed:', err)
      setToast({
        type: 'error',
        message: 'Failed to submit employee data. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
      setSubmitProgress(0)
      setSubmitStage(null)
    }
  }

  function handleClearDraft() {
    if (isSubmitting) return

    const confirmed = window.confirm(
      'Are you sure you want to clear this draft?'
    )
    if (!confirmed) return

    try {
      window.localStorage.removeItem(storageKey)
    } catch (err) {
      console.error('Failed to clear draft', err)
    }

    setErrorsStep1({})
    setErrorsStep2({})

    if (isOpsMode) {
      setStep(2)
      setStep1(emptyStep1)
      setStep2(emptyStep2)
    } else {
      setStep(1)
      setStep1(emptyStep1)
      setStep2(emptyStep2)
    }

    setToast({
      type: 'success',
      message: 'Draft cleared successfully.'
    })
  }

  // ---------- Render ----------

  const stepInfoLabel = isOpsMode
    ? 'Ops: only Step 2 is required'
    : `Step ${step} of 2`

  return (
    <div className={styles['c-two-step-form']}>
      <form className={styles['c-two-step-form__card']} onSubmit={handleSubmit}>
        <header className={styles['c-two-step-form__header']}>
          <h1 className={styles['c-two-step-form__title']}>Add Employee</h1>
          <p className={styles['c-two-step-form__subtitle']}>
            {isOpsMode
              ? 'Ops: only employment details are required.'
              : 'Admin: fill basic info and employment details.'}
          </p>
        </header>

        <div className={styles['c-two-step-form__step-info']}>
          {stepInfoLabel}
        </div>

        <div className={styles['c-two-step-form__content']}>
          {!isOpsMode && step === 1 && (
            <StepOneForm
              data={step1}
              errors={errorsStep1 as any}
              onChange={handleStep1Change}
              onDepartmentChange={handleDepartmentChange}
            />
          )}

          {(!isOpsMode && step === 2) || isOpsMode ? (
            <StepTwoForm
              data={step2}
              errors={errorsStep2 as any}
              onChange={handleStep2Change}
              onPhotoChange={handlePhotoChange}
              onOfficeLocationChange={handleOfficeLocationChange}
            />
          ) : null}
        </div>

        {isSubmitting && (
          <div className={styles['c-two-step-form__progress']}>
            <div className={styles['c-two-step-form__progress-bar-wrapper']}>
              <div
                className={styles['c-two-step-form__progress-bar']}
                style={{ width: `${submitProgress}%` }}
                data-testid="two-step-form-progress"
              />
            </div>
            {submitStage && (
              <div
                className={styles['c-two-step-form__progress-label']}
                data-testid="two-step-form-progress-stage"
              >
                {submitStage}
              </div>
            )}
          </div>
        )}

        <div className={styles['c-two-step-form__actions']}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClearDraft}
            disabled={isSubmitting}
          >
            Clear Draft
          </Button>

          <div className={styles['c-two-step-form__actions-right']}>
            {!isOpsMode && step === 2 && (
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
            )}

            {!isOpsMode && step === 1 && (
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            )}

            {((!isOpsMode && step === 2) || isOpsMode) && (
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        </div>
        {toast && (
          <div
            className={`${styles['c-two-step-form__toast']} ${
              toast.type === 'error'
                ? styles['c-two-step-form__toast--error']
                : styles['c-two-step-form__toast--success']
            }`}
            data-testid="two-step-form-toast"
          >
            {toast.message}
          </div>
        )}
      </form>
    </div>
  )
}
