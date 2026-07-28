"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { categories, menuItems, Category } from "@/lib/menu-data"

export type CartLine = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function MenuPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  
  // Local cart state tracking item quantities: { itemId: quantity }
  const [cart, setCart] = useState<Record<string, number>>({})

  // Filter items dynamically based on tab, search query, and popular flag
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesPopular = !showPopularOnly || item.popular

      return matchesCategory && matchesSearch && matchesPopular
    })
  }, [selectedCategory, searchQuery, showPopularOnly])

  // Cart operations
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0
      const next = current + delta
      if (next <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  // Calculate cart stats
  const cartItemCount = useMemo(
    () => Object.values(cart).reduce((sum, q) => sum + q, 0),
    [cart]
  )

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = menuItems.find((m) => m.id === id)
      return total + (item ? item.price * qty : 0)
    }, 0)
  }, [cart])

  // Handler to safely persist cart and navigate to /checkout
  const handleCheckout = () => {
    // Format cart map into an array of full item details + quantity
    const formattedCartItems = Object.entries(cart)
      .map(([id, qty]) => {
        const item = menuItems.find((m) => m.id === id)
        if (!item) return null
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: qty,
        }
      })
      .filter(Boolean)

    if (formattedCartItems.length === 0) return

    try {
      // Safely save cart items to local storage
      localStorage.setItem("marigold_cart", JSON.stringify(formattedCartItems))
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e)
    }

    // Navigate to Checkout
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#E6E1DC]">
      {/* Header Banner */}
      <header className="border-b border-[#2A2420] bg-[#141210] py-8 text-center shadow-lg">
        <h1 className="font-serif text-3xl font-bold tracking-wide text-[#E6E1DC] sm:text-4xl">
          Marigold Menu
        </h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-[#C67D3B]">
          Fresh Seasonal Ingredients & Handcrafted Dishes
        </p>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
        {/* Left Column: Menu Controls & Item Grid */}
        <div className="flex-1">
          {/* Search & Quick Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search dishes, ingredients, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#2A2420] bg-[#141210] px-4 py-3 pl-10 text-sm text-[#E6E1DC] placeholder-[#8C7B70] focus:border-[#C67D3B] focus:outline-none"
              />
              <svg
                className="absolute left-3 top-3.5 h-4 w-4 text-[#8C7B70]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Popular Filter Toggle */}
            <button
              onClick={() => setShowPopularOnly(!showPopularOnly)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition ${
                showPopularOnly
                  ? "border-[#C67D3B] bg-[#C67D3B] text-[#0C0B0A]"
                  : "border-[#2A2420] bg-[#141210] text-[#8C7B70] hover:border-[#8C7B70] hover:text-[#E6E1DC]"
              }`}
            >
              <span>★ Popular Only</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto border-b border-[#2A2420] pb-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-lg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                  selectedCategory === cat.id
                    ? "bg-[#C67D3B] text-[#0C0B0A]"
                    : "bg-[#141210] text-[#8C7B70] hover:bg-[#2A2420] hover:text-[#E6E1DC]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-[#2A2420] bg-[#141210] p-12 text-center text-[#8C7B70]">
              No menu items match your current selection or search terms.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                const qty = cart[item.id] || 0

                return (
                  <div
                    key={item.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2A2420] bg-[#141210] transition hover:border-[#8C7B70]"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative h-48 w-full overflow-hidden bg-[#0C0B0A]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        {item.popular && (
                          <span className="absolute left-3 top-3 rounded-full bg-[#C67D3B] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0C0B0A]">
                            Popular
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-lg font-bold text-[#E6E1DC]">
                            {item.name}
                          </h3>
                          <span className="font-serif text-base font-bold text-[#C67D3B]">
                            ₹{item.price}
                          </span>
                        </div>

                        <p className="mt-2 text-xs leading-relaxed text-[#8C7B70]">
                          {item.description}
                        </p>

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-[#2A2420] px-2 py-0.5 text-[10px] text-[#8C7B70]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Action / Quantity Control */}
                    <div className="border-t border-[#2A2420] p-4">
                      {qty === 0 ? (
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-full rounded-xl border border-[#C67D3B]/40 bg-[#0C0B0A] py-2.5 text-xs font-semibold uppercase tracking-wider text-[#C67D3B] transition hover:bg-[#C67D3B] hover:text-[#0C0B0A]"
                        >
                          + Add to Order
                        </button>
                      ) : (
                        <div className="flex items-center justify-between rounded-xl border border-[#C67D3B] bg-[#0C0B0A] p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2A2420] font-bold text-[#E6E1DC] hover:bg-[#C67D3B] hover:text-[#0C0B0A]"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold text-[#E6E1DC]">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2A2420] font-bold text-[#E6E1DC] hover:bg-[#C67D3B] hover:text-[#0C0B0A]"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Order Summary Sidebar */}
        <aside className="w-full lg:w-80 lg:shrink-0">
          <div className="sticky top-6 rounded-2xl border border-[#2A2420] bg-[#141210] p-6 shadow-xl">
            <h2 className="border-b border-[#2A2420] pb-4 font-serif text-xl font-bold text-[#E6E1DC]">
              Your Order
            </h2>

            {cartItemCount === 0 ? (
              <div className="py-12 text-center text-xs text-[#8C7B70]">
                Your cart is empty. Select items from the menu to start ordering.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Selected Items List */}
                <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = menuItems.find((m) => m.id === id)
                    if (!item) return null

                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-[#E6E1DC]">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-[#8C7B70]">
                            ₹{item.price} x {qty}
                          </p>
                        </div>
                        <span className="font-bold text-[#C67D3B]">
                          ₹{item.price * qty}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-[#2A2420] pt-4">
                  <div className="flex justify-between text-sm font-bold text-[#E6E1DC]">
                    <span>Total Amount</span>
                    <span className="text-[#C67D3B]">₹{cartTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="block w-full rounded-xl bg-[#C67D3B] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a]"
                >
                  Proceed to Checkout ({cartItemCount})
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}