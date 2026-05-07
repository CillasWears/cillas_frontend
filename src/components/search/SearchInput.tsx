'use client'

import { useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search products and stories...',
  autoFocus = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <Search
        size={20}
        strokeWidth={1.5}
        className="absolute left-lg top-1/2 -translate-y-1/2 
                   text-secondary-grey pointer-events-none"
        aria-hidden="true"
      />

      {/* Input */}
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className={cn(
          'w-full bg-transparent border border-secondary-grey/40',
          'text-primary-white text-body',
          'pl-2xl pr-2xl py-lg',
          'placeholder:text-secondary-grey/60',
          'hover:border-secondary-grey',
          'focus:outline-none focus:border-accent-gold',
          'transition-colors duration-150'
        )}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-lg top-1/2 -translate-y-1/2
                     text-secondary-grey hover:text-accent-gold
                     transition-colors duration-150
                     focus-visible:outline-none 
                     focus-visible:text-accent-gold"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}
