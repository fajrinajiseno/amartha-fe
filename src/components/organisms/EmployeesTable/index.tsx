import styles from './index.module.scss'
import type { EmployeeRow } from '@/types/employee'
import { SkeletonRows } from './SkeletonRows'

type Props = {
  employees: EmployeeRow[]
  loading: boolean
}

export function EmployeesTable({ employees, loading }: Props) {
  return (
    <section className={styles['c-employees-table']}>
      <div className={styles['c-employees-table__wrapper']}>
        <table className={styles['c-employees-table__table']}>
          <thead>
            <tr>
              <th className={styles['c-employees-table__th']}>Photo</th>
              <th className={styles['c-employees-table__th']}>Name</th>
              <th className={styles['c-employees-table__th']}>Department</th>
              <th className={styles['c-employees-table__th']}>Role</th>
              <th className={styles['c-employees-table__th']}>Location</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : employees.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className={styles['c-employees-table__empty-state']}
                  data-testid="employees-table-empty"
                >
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className={styles['c-employees-table__row']}>
                  <td className={styles['c-employees-table__td']}>
                    {emp.photoBase64 ? (
                      <img
                        src={emp.photoBase64}
                        alt={emp.name}
                        className={styles['c-employees-table__avatar']}
                        data-testid={`employees-table-${emp.id}-avatar`}
                      />
                    ) : (
                      <div
                        className={
                          styles['c-employees-table__avatar-placeholder']
                        }
                      />
                    )}
                  </td>
                  <td
                    className={styles['c-employees-table__td']}
                    data-testid={`employees-table-${emp.id}-name`}
                  >
                    {emp.name}
                  </td>
                  <td
                    className={styles['c-employees-table__td']}
                    data-testid={`employees-table-${emp.id}-department`}
                  >
                    {emp.department}
                  </td>
                  <td
                    className={styles['c-employees-table__td']}
                    data-testid={`employees-table-${emp.id}-role`}
                  >
                    {emp.role}
                  </td>
                  <td
                    className={styles['c-employees-table__td']}
                    data-testid={`employees-table-${emp.id}-location`}
                  >
                    {emp.location}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
