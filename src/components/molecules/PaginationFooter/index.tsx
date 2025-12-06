import styles from './index.module.scss'
import { Button } from '@/components/atoms/Button'

type Props = {
  page: number
  totalPages?: number | null
  hasPrev: boolean
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
}

export function PaginationFooter({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext
}: Props) {
  return (
    <footer className={styles['c-pagination-footer']}>
      <span className={styles['c-pagination-footer__info']}>
        Page {page}
        {totalPages ? ` of ${totalPages}` : ''}
      </span>

      <div className={styles['c-pagination-footer__actions']}>
        <Button
          type="button"
          disabled={!hasPrev}
          onClick={onPrev}
          data-testid="pagination-footer-prev"
        >
          Previous
        </Button>
        <Button
          type="button"
          disabled={!hasNext}
          onClick={onNext}
          data-testid="pagination-footer-next"
        >
          Next
        </Button>
      </div>
    </footer>
  )
}
