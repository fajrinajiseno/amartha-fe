import React from 'react'
import styles from './index.module.scss'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean
}

export function Textarea({ hasError, className = '', ...rest }: Props) {
  const classes = [
    styles['c-textarea'],
    hasError ? styles['c-textarea--error'] : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return <textarea {...rest} className={classes} />
}
