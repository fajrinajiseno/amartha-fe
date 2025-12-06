import React from 'react'
import styles from './index.module.scss'

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean
}

export function Select({ hasError, className = '', ...rest }: Props) {
  const classes = [
    styles['c-select'],
    hasError ? styles['c-select--error'] : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return <select {...rest} className={classes} />
}
