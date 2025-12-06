import styles from './index.module.scss'

type Props = {
  message?: string
}

export function ErrorText({ message }: Props) {
  if (!message) return null
  return <p className={styles['c-error-text']}>{message}</p>
}
