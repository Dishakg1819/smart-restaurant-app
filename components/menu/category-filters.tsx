'use client'

import { categories, type Category } from '@/lib/menu-data'
import { cn } from '@/lib/utils'

type CategoryFiltersProps = {
  active: Category | 'all'
  onChange: (category: Category | 'all') => void
}

export function CategoryFilters({ active, onChange }: CategoryFiltersProps) {
  return (
    <div
      role="tablist"
      aria-label="Menu categories"
      className="flex flex-wrap gap-2"
    >
      {categories.map((category) => {
        const isActive = active === category.id
        return (
          <button
            key={category.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category.id)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
