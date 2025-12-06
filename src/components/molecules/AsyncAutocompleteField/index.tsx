'use client'

import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { Label } from '@/components/atoms/Label'
import { Input } from '@/components/atoms/Input'
import { ErrorText } from '@/components/atoms/ErrorText'

export type Option = { id: string | number; name: string }

type Props = {
  label: string
  name: string
  value: string
  search: (params: Record<string, string>) => Promise<Option[]>
  onSelect: (name: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
}

const debounceDelay = 300
const blurDelay = 100

export function AsyncAutocompleteField({
  label,
  name,
  value,
  search,
  onSelect,
  error,
  placeholder,
  disabled
}: Props) {
  const [query, setQuery] = useState(value)
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const hasError = Boolean(error)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    if (disabled) return

    if (!open || !query.trim()) {
      setOptions([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await search({ name_like: query })
        if (!cancelled) {
          setOptions(result)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Autocomplete fetch error', err)
          setOptions([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, debounceDelay)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [query, open, search, disabled])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (disabled) return

    const q = e.target.value
    setQuery(q)

    if (!q.trim()) {
      setOptions([])
      setOpen(false)
      onSelect('')
      return
    }

    setOpen(true)
  }

  function handleSelect(option: Option) {
    setQuery(option.name)
    onSelect(option.name)
    setOpen(false)
  }

  function handleBlur() {
    window.setTimeout(() => {
      setOpen(false)
      if (query.trim() && query !== value) {
        setQuery(value)
      }
    }, blurDelay)
  }

  function handleFocus() {
    if (disabled) return
    setOpen(true)
  }

  return (
    <div className={styles['c-autocomplete']}>
      <Label htmlFor={name} className={styles['c-autocomplete__label']}>
        {label}
      </Label>

      <Input
        id={name}
        name={name}
        value={query}
        placeholder={placeholder}
        hasError={hasError}
        disabled={disabled}
        autoComplete="off"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {loading && (
        <p className={styles['c-autocomplete__helper']}>
          Searching {label.toLowerCase()}...
        </p>
      )}

      <ErrorText message={error} />

      {open && !disabled && options.length > 0 && (
        <ul className={styles['c-autocomplete__list']}>
          {options.map((opt) => (
            <li
              key={opt.id}
              data-testid={`autocomplete-${name}-${opt.id}`}
              className={styles['c-autocomplete__item']}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(opt)
              }}
            >
              {opt.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
