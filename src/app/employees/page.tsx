'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './index.module.scss'
import { EmployeesTable } from '@/components/organisms/EmployeesTable'
import { PaginationFooter } from '@/components/molecules/PaginationFooter'
import { BasicInfo, Details, EmployeeRow } from '@/types/employee'
import { getBasicInfo, getDetails } from '@/lib/api'

const DEFAULT_LIMIT = 10

export default function EmployeesPage() {
  return (
    <Suspense>
      <EmployeesPageContent />
    </Suspense>
  )
}

function EmployeesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = Number(searchParams?.get('page') ?? '1') || 1
  const limit =
    Number(searchParams?.get('limit') ?? DEFAULT_LIMIT) || DEFAULT_LIMIT

  const [employees, setEmployees] = useState<EmployeeRow[]>([])
  const [totalPages, setTotalPages] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true)
        setError(null)

        const query = {
          _page: String(page),
          _limit: String(limit)
        }

        const [basicRes, detailsRes] = await Promise.all([
          getBasicInfo(query),
          getDetails(query)
        ])

        const basicInfos: BasicInfo[] = basicRes.data
        const details: Details[] = detailsRes.data

        const totalCountHeader = detailsRes.total
        if (totalCountHeader) {
          const totalCount = Number(totalCountHeader)
          if (!Number.isNaN(totalCount) && limit > 0) {
            setTotalPages(Math.max(1, Math.ceil(totalCount / limit)))
          } else {
            setTotalPages(null)
          }
        } else {
          setTotalPages(null)
        }

        const basicById = new Map<string, BasicInfo>(
          basicInfos.map((b) => [b.employeeId, b])
        )

        const merged: EmployeeRow[] = details.map((d) => {
          const b = d.employeeId ? basicById.get(d.employeeId) : undefined
          return {
            id: d.id,
            name: b?.fullName || '-',
            department: b?.department || '-',
            role: b?.role || '-',
            location: d.officeLocation || '-',
            photoBase64: d.photoBase64 ?? null
          }
        })

        setEmployees(merged)
      } catch (err: any) {
        if (err?.name === 'AbortError') return
        setError(err?.message ?? 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
    return () => {}
  }, [page, limit])

  const hasPrev = page > 1
  const hasNext =
    totalPages !== null ? page < totalPages : employees.length === limit

  const goToPage = (target: number) => {
    if (target < 1) return

    const params = new URLSearchParams(searchParams?.toString())
    params.set('page', String(target))
    params.set('limit', String(limit))

    router.push(`/employees?${params.toString()}`)
  }

  return (
    <main className={styles['p-employees-page']}>
      <header className={styles['p-employees-page__header']}>
        <h1 className={styles['p-employees-page__title']}>Employees</h1>

        <div className={styles['p-employees-page__actions']}>
          <Link
            href="/wizard?role=admin"
            className={styles['p-employees-page__button']}
          >
            Add Admin
          </Link>
          <Link
            href="/wizard?role=ops"
            className={styles['p-employees-page__button']}
          >
            Add Ops
          </Link>
        </div>
      </header>

      {error && (
        <div
          className={styles['p-employees-page__error']}
          data-testid="employees-page-error"
        >
          {error}
        </div>
      )}

      <EmployeesTable employees={employees} loading={loading} />

      <PaginationFooter
        page={page}
        totalPages={totalPages}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={() => goToPage(page - 1)}
        onNext={() => goToPage(page + 1)}
      />
    </main>
  )
}
