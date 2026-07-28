'use client'

import React, { useState } from 'react'
import { ShoppingBag, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ItemCard } from '@/components/order/item-card'
import { CartDrawer } from '@/components/order/cart-drawer'

const CATEGORIES = [
  { id: 'appetizers', label: 'Appetizers' },
  { id: 'mains', label: 'Main Courses' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'beverages', label: 'Beverages' }
]

const MENU_ITEMS = [
  {
    id: '1',
    name: 'Marigold Special Curry',
    description: 'Aromatic spices blend with fresh coconut milk and seasonal veggies.',
    price: 15.0,
    category: 'mains',
    is_available: true
  },
  {
    id: '2',
    name: 'Garlic Naan',
    description: 'Freshly baked oven bread brushed with rich garlic butter.',
    price: 2.5,
    category: 'appetizers',
    is_available: true
  },
  {
    id: '3',
    name: 'Crispy Butter Chicken',
    description: 'Tender chicken pieces simmered in a creamy tomato gravy.',
    price: 18.5,
    category: 'mains',
    is_available: true
  },
  {
    id: '4',
    name: 'Paneer Tikka',
    description: 'Chargrilled cottage cheese cubes marinated in spiced yogurt.',
    price: 14.0,
    category: 'appetizers',
    is_available: true
  },
  {
    id: '5',
    name: 'Mango Lassi',
    description: 'Chilled yogurt drink blended with sweet Alphonso mango pulp.',
    price: 3.5,
    category: 'beverages',
    is_available: true
  }
]

const TABLE_NUMBER = 5

const AnyCartDrawer = CartDrawer as any

export default function TableOrder() {
  const [activeCategory, setActiveCategory] = useState<string>('appetizers')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)

  const handleAddItem = (item: any) => {
    setQuantities((q) => ({ ...q, [item.id]: (q[item.id] ?? 0) + 1 }))
  }

  const handleRemoveItem = (item: any) => {
    setQuantities((q) => {
      const currentQty = q[item.id] ?? 0
      if (currentQty <= 1) {
        const copy = { ...q }
        delete copy[item.id]
        return copy
      }
      return { ...q, [item.id]: currentQty - 1 }
    })
  }

  const filteredItems = MENU_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true
    return item.category.toLowerCase() === activeCategory.toLowerCase()
  })

  const totalCartCount = Object.values(quantities).reduce((a, b) => a + b, 0)

  const cartItems = Object.entries(quantities)
    .map(([id, quantity]) => {
      const item = MENU_ITEMS.find((m) => m.id === id)
      return item ? { ...item, quantity } : null
    })
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#E6E1DC] pb-24 font-sans">
      <header className="sticky top-0 z-20 border-b border-[#241E1A] bg-[#0C0B0A]/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border border-[#3D2C1E] bg-[#1A140E] text-[#C67D3B]">
              <Utensils className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#E6E1DC]">Marigold Dining</h1>
              <p className="text-xs text-[#8C7B70]">Table #{TABLE_NUMBER}</p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full bg-[#C67D3B] px-4 py-2 text-xs font-semibold text-[#0C0B0A] hover:bg-[#D88D43] transition"
          >
            <ShoppingBag className="size-4" />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="ml-1 rounded-full bg-[#0C0B0A] px-2 py-0.5 text-[10px] font-bold text-[#C67D3B]">
                {totalCartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <div className="no-scrollbar mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            key="all"
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              activeCategory === 'all'
                ? 'bg-[#C67D3B] text-[#0C0B0A] font-semibold'
                : 'border border-[#241E1A] bg-[#12100E] text-[#B5A89E] hover:text-[#E6E1DC]'
            }`}
          >
            All Items
          </button>

          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#C67D3B] text-[#0C0B0A] font-semibold'
                  : 'border border-[#241E1A] bg-[#12100E] text-[#B5A89E] hover:text-[#E6E1DC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item as any}
              quantity={quantities[item.id] ?? 0}
              onAdd={() => handleAddItem(item)}
              onRemove={() => handleRemoveItem(item)}
            />
          ))}
        </div>
      </main>

      <AnyCartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        tableNumber={TABLE_NUMBER}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  )
}