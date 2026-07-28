'use client'

import Image from 'next/image'
import { Plus, Minus, Star } from 'lucide-react'
import type { MenuItem } from '@/lib/menu-data'
import { Button } from '@/components/ui/button'

type ItemCardProps = {
  item: MenuItem
  quantity: number
  onAdd: (item: MenuItem) => void
  onRemove: (id: string) => void
}

export function ItemCard({ item, quantity, onAdd, onRemove }: ItemCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.popular && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            <Star className="h-3 w-3 fill-current" aria-hidden="true" />
            Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg font-semibold leading-tight text-card-foreground text-pretty">
            {item.name}
          </h3>
          <span className="shrink-0 font-serif text-lg font-semibold text-primary">
            ${item.price}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2">
          {quantity === 0 ? (
            <Button
              onClick={() => onAdd(item)}
              className="w-full gap-2 rounded-xl font-semibold"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add to order
            </Button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-border bg-background p-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onRemove(item.id)}
                className="h-9 w-9 rounded-lg"
                aria-label={`Remove one ${item.name}`}
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span
                className="min-w-8 text-center font-semibold tabular-nums text-foreground"
                aria-live="polite"
              >
                {quantity}
              </span>
              <Button
                size="icon"
                onClick={() => onAdd(item)}
                className="h-9 w-9 rounded-lg"
                aria-label={`Add one ${item.name}`}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
