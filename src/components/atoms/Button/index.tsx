import React from 'react'
import styles from './index.module.scss'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}: Props) {
  const { disabled } = rest

  const classes = [
    styles['c-button'],
    variant === 'primary'
      ? styles['c-button--primary']
      : styles['c-button--secondary'],
    disabled ? styles['c-button--disabled'] : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
