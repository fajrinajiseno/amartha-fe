import { ReactNode } from 'react'
import styles from './index.module.scss'

type Props = {
  htmlFor: string
  children: ReactNode
  className?: string
}

export function Label({ htmlFor, children, className }: Props) {
  const classes = [styles['c-label'], className].filter(Boolean).join(' ')
  return (
    <label htmlFor={htmlFor} className={classes}>
      {children}
    </label>
  )
}
