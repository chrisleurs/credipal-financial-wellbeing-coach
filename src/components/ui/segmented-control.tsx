
import React from 'react'
import { cn } from '@/lib/utils'

interface SegmentedControlProps {
  value: string
  onValueChange: (value: string) => void
  options: Array<{
    value: string
    label: string
  }>
  className?: string
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  value,
  onValueChange,
  options,
  className
}) => {
  return (
    <div className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1",
      className
    )}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onValueChange(option.value)}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            "min-h-[44px] flex-1",
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
