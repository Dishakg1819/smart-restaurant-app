'use client'

import { useMemo, useState } from 'react'
import { Search, UtensilsCrossed, MapPin, Clock } from 'lucide-react'
import { menuItems, type Category, type MenuItem } from '@/lib/menu-data'
import { CategoryFilters } from './category-filters'
import { ItemCard } from './item-card'
import { CartPreview, type CartLine } from './cart-preview'

export function MenuExperience() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Record<string, number>>({})

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory
      const matchesQuery =
        query.trim() === '' ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  const addItem = (item: MenuItem) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + 1 }))
  }

  const removeItem = (id: string) => {
    setCart((prev) => {
      const next = { ...prev }
      const current = next[id] ?? 0
      if (current <= 1) {
        delete next[id]
      } else {
        next[id] = current - 1
      }
      return next
    })
  }

  const clearCart = () => setCart({})

  const lines: CartLine[] = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const item = menuItems.find((m) => m.id === id)
        return item ? { item, quantity } : null
      })
      .filter((line): line is CartLine => line !== null)
  }, [cart])

  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="font-serif text-xl font-semibold text-foreground">Marigold</p>
              <p className="text-xs text-muted-foreground">Seasonal Kitchen</p>
            </div>
          </div>
          <div className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Downtown
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Open until 11 PM
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="max-w-2xl">
          <p className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            Dinner Menu
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground text-balance sm:text-5xl">
            Fresh, seasonal dishes made to share
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Explore our menu, filter by course, and build your order. Your cart updates
            live as you go.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {/* Controls */}
            <div className="sticky top-[73px] z-20 -mx-4 mb-6 space-y-4 bg-background/85 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:px-0 sm:py-0 sm:backdrop-blur-none">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dishes..."
                  aria-label="Search dishes"
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <CategoryFilters active={activeCategory} onChange={setActiveCategory} />
            </div>

            {/* Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    quantity={cart[item.id] ?? 0}
                    onAdd={addItem}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
                <p className="font-semibold text-foreground">No dishes found</p>
                <p className="text-sm text-muted-foreground">
                  Try a different category or search term.
                </p>
              </div>
            )}
          </div>

          {/* Cart */}
          <CartPreview
            lines={lines}
            totalItems={totalItems}
            subtotal={subtotal}
            onAdd={addItem}
            onRemove={removeItem}
            onClear={clearCart}
          />
        </div>
      </div>

      {/* Spacer so mobile floating bar doesn't cover content */}
      {totalItems > 0 && <div className="h-24 lg:hidden" aria-hidden="true" />}
    </div>
  )
}
