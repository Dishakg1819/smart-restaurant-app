"use client"

import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MenuItem } from "@/lib/order-data"

type ItemCardProps = {
  item: MenuItem
  quantity: number
  onAdd: (item: MenuItem) => void
  onRemove: (item: MenuItem) => void
}

export function ItemCard({ item, quantity, onAdd, onRemove }: ItemCardProps) {
  // Extract image path cleanly across different naming conventions
  const itemAny = item as Record<string, unknown>
  const imageSrc =
    (typeof item.image === "string" && item.image) ||
    (typeof itemAny.imageUrl === "string" && itemAny.imageUrl) ||
    (typeof itemAny.image_url === "string" && itemAny.image_url) ||
    "/placeholder.svg"

  // Safely format price
  const formattedPrice =
    typeof item.price === "number"
      ? item.price.toFixed(2)
      : parseFloat(String(item.price || 0)).toFixed(2)

  const itemTag =
    typeof item.tags === "string"
      ? item.tags
      : Array.isArray(item.tags) && item.tags.length > 0
      ? item.tags[0]
      : undefined

  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-card p-3 transition-colors hover:border-primary/40">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28">
        <Image
          src={imageSrc}
          alt={item.name || "Menu item"}
          fill
          sizes="(max-width: 640px) 96px, 112px"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-base leading-tight text-card-foreground text-pretty">
            {item.name}
          </h3>
          <span className="shrink-0 font-serif text-base text-primary">
            ${formattedPrice}
          </span>
        </div>

        {itemTag ? (
          <span className="mt-1 w-fit rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
            {itemTag}
          </span>
        ) : null}

        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-end pt-2">
          {quantity === 0 ? (
            <Button
              size="sm"
              onClick={() => onAdd(item)}
              className="rounded-full px-4 font-semibold"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add to Order
            </Button>
          ) : (
            <div className="flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 p-1">
              <button
                type="button"
                onClick={() => onRemove(item)}
                aria-label={`Remove one ${item.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-background/60 text-foreground transition-colors hover:bg-background"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-4 text-center text-sm font-semibold tabular-nums text-foreground">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onAdd(item)}
                aria-label={`Add one ${item.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}