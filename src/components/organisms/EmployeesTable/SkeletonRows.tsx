import styles from './index.module.scss'

type Props = {
  count?: number
}

export function SkeletonRows({ count = 3 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <tr key={index} className={styles['c-employees-table__skeleton-row']}>
          <td className={styles['c-employees-table__td']}>
            <div
              className={`${styles['c-employees-table__avatar-placeholder']} ${styles['c-employees-table__skeleton-block']}`}
            />
          </td>
          <td className={styles['c-employees-table__td']}>
            <div
              className={styles['c-employees-table__skeleton-block']}
              style={{ width: '120px' }}
            />
          </td>
          <td className={styles['c-employees-table__td']}>
            <div
              className={styles['c-employees-table__skeleton-block']}
              style={{ width: '90px' }}
            />
          </td>
          <td className={styles['c-employees-table__td']}>
            <div
              className={styles['c-employees-table__skeleton-block']}
              style={{ width: '80px' }}
            />
          </td>
          <td className={styles['c-employees-table__td']}>
            <div
              className={styles['c-employees-table__skeleton-block']}
              style={{ width: '70px' }}
            />
          </td>
        </tr>
      ))}
    </>
  )
}
