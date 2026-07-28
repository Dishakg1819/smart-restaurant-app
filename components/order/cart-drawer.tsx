"use client"

import { CartLine } from "@/app/menu/page" // Adjust path if needed
import { MenuItem } from "@/lib/order-data"
import { ShoppingBag, X, Plus, Minus } from "lucide-react"

export interface CartDrawerProps {
  open: boolean
  onClose: () => void
  lines: CartLine[]
  onAdd: (item: MenuItem) => void
  onRemove: (item: MenuItem) => void
  tableNumber: number
  onCheckout?: () => Promise<void> | void // Added optional checkout handler
  isSubmitting?: boolean                  // Added submission state
}

export function CartDrawer({
  open,
  onClose,
  lines,
  onAdd,
  onRemove,
  tableNumber,
  onCheckout,
  isSubmitting = false,
}: CartDrawerProps) {
  if (!open) return null

  const total = lines.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Your Order (Table #{tableNumber})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <ShoppingBag className="mb-2 h-10 w-10 stroke-1" />
              <p className="text-sm">Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lines.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex-1 pr-3">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemove(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-primary">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onAdd(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout Button */}
        {lines.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={onCheckout}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
            >
              {isSubmitting ? "Sending to Kitchen..." : "Send Order to Kitchen"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}