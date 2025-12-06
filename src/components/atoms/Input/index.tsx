import React from 'react'
import styles from './index.module.scss'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
}

export function Input({ hasError, disabled, className = '', ...rest }: Props) {
  const classes = [
    styles['c-input'],
    hasError ? styles['c-input--error'] : '',
    disabled ? styles['c-input--disabled'] : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return <input {...rest} disabled={disabled} className={classes} />
}
