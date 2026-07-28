'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Plus, Minus, ShoppingBag, Trash2, ChevronUp, X } from 'lucide-react'
import type { MenuItem } from '@/lib/menu-data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CartLine = { item: MenuItem; quantity: number }

type CartPreviewProps = {
  lines: CartLine[]
  totalItems: number
  subtotal: number
  onAdd: (item: MenuItem) => void
  onRemove: (id: string) => void
  onClear: () => void
}

const TAX_RATE = 0.08

function CartBody({
  lines,
  subtotal,
  onAdd,
  onRemove,
  onClear,
}: Omit<CartPreviewProps, 'totalItems'>) {
  const router = useRouter()
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const handleCheckout = () => {
    // Map lines to the format expected by the checkout page
    const checkoutCart = lines.map(line => ({
      id: line.item.id,
      name: line.item.name,
      price: line.item.price,
      quantity: line.quantity
    }))
    
    // Save to localStorage
    localStorage.setItem('marigold_cart', JSON.stringify(checkoutCart))
    
    // Navigate to checkout
    router.push('/checkout')
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-card-foreground">
          <ShoppingBag className="h-5 w-5 text-primary" aria-hidden="true" />
          Your Order
        </h2>
        {lines.length > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="font-medium text-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Add dishes to start your order.</p>
        </div>
      ) : (
        <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {lines.map(({ item, quantity }) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight text-card-foreground text-pretty">
                    {item.name}
                  </p>
                  <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                    ${(item.price * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg border border-border">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemove(item.id)}
                      className="h-7 w-7 rounded-md"
                      aria-label={`Remove one ${item.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                    <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onAdd(item)}
                      className="h-7 w-7 rounded-md"
                      aria-label={`Add one ${item.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">${item.price} each</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {lines.length > 0 && (
        <div className="border-t border-border px-5 py-4">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Tax (8%)</dt>
              <dd className="tabular-nums">${tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between pt-1.5 text-base font-semibold text-foreground">
              <dt>Total</dt>
              <dd className="tabular-nums">${total.toFixed(2)}</dd>
            </div>
          </dl>
          <Button 
            onClick={handleCheckout}
            className="mt-4 w-full rounded-xl py-6 text-base font-semibold"
          >
            Checkout
          </Button>
        </div>
      )}
    </>
  )
}

export function CartPreview(props: CartPreviewProps) {
  const { lines, totalItems, subtotal } = props
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <CartBody {...props} />
        </div>
      </aside>

      {/* Mobile floating bar */}
      {totalItems > 0 && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-lg lg:hidden"
        >
          <span className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/20 text-sm tabular-nums">
              {totalItems}
            </span>
            View order
          </span>
          <span className="flex items-center gap-2 font-semibold tabular-nums">
            ${subtotal.toFixed(2)}
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            'absolute inset-0 bg-foreground/40 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-card shadow-xl transition-transform duration-300',
            mobileOpen ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          <div className="flex justify-end px-3 pt-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setMobileOpen(false)}
              className="h-8 w-8 rounded-full"
              aria-label="Close order summary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <CartBody {...props} />
        </div>
      </div>
    </>
  )
}
