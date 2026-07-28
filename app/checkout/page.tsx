"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cash">("upi")

  // Safely load cart items after component mounts on client side
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("marigold_cart")
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          setCartItems(parsed)
        }
      }
    } catch (e) {
      console.error("Error reading cart from localStorage:", e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Bill Calculations safely wrapped
  const itemTotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  )
  const gstTax = Math.round(itemTotal * 0.05) // 5% GST
  const serviceCharge = itemTotal > 0 ? 30 : 0
  const grandTotal = itemTotal + gstTax + serviceCharge

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) return
    setIsProcessing(true)

    // Store billing metadata for success page
    const orderPayload = {
      items: cartItems,
      itemTotal,
      gstTax,
      serviceCharge,
      grandTotal,
      paymentMethod,
    }
    
    try {
      localStorage.setItem("pending_order", JSON.stringify(orderPayload))
    } catch (e) {
      console.error("Failed to save pending order:", e)
    }

    // Simulate Payment gateway delay before navigating to success page
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/payment-success")
    }, 1200)
  }

  // 1. Loading state to prevent hydration error during client mount
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0B0A] text-[#E6E1DC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C67D3B] border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-[#8C7B70]">Loading Invoice...</p>
        </div>
      </div>
    )
  }

  // 2. Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0B0A] px-4 text-[#E6E1DC]">
        <div className="w-full max-w-md rounded-2xl border border-[#2A2420] bg-[#141210] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#2A2420] bg-[#0C0B0A] text-[#8C7B70]">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold text-[#E6E1DC]">Your Cart is Empty</h2>
          <p className="mt-2 text-xs text-[#8C7B70]">
            Please add items from the menu before attempting to checkout.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-block rounded-xl bg-[#C67D3B] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a]"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    )
  }

  // 3. Checkout & Bill View
  return (
    <div className="min-h-screen bg-[#0C0B0A] px-4 py-8 text-[#E6E1DC] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 border-b border-[#2A2420] pb-6">
          <Link href="/menu" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#C67D3B] hover:underline">
            ← Back to Menu
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-wide text-[#E6E1DC] sm:text-4xl">
            Checkout & Bill
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-[#8C7B70]">
            Review your invoice and choose payment method
          </p>
        </div>

        {/* Invoice Card */}
        <div className="rounded-2xl border border-[#2A2420] bg-[#141210] p-6 shadow-2xl sm:p-8">
          <h2 className="border-b border-[#2A2420] pb-4 font-serif text-lg font-bold text-[#E6E1DC]">
            Order Summary
          </h2>

          {/* Itemized list */}
          <div className="my-4 divide-y divide-[#2A2420]/60">
            {cartItems.map((item, idx) => (
              <div key={item.id || idx} className="flex justify-between py-3 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#2A2420] bg-[#0C0B0A] font-mono text-xs font-bold text-[#C67D3B]">
                    {item.quantity}
                  </span>
                  <span className="font-medium text-[#E6E1DC]">{item.name}</span>
                </div>
                <span className="font-serif font-semibold text-[#E6E1DC]">
                  ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Bill Breakdown */}
          <div className="space-y-2 border-t border-[#2A2420] pt-4 text-xs text-[#8C7B70]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-[#E6E1DC]">₹{itemTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="text-[#E6E1DC]">₹{gstTax.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Service & Dining Fee</span>
              <span className="text-[#E6E1DC]">₹{serviceCharge.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between border-t border-[#2A2420] pt-3 text-sm font-bold text-[#E6E1DC]">
              <span>Grand Total</span>
              <span className="font-serif text-lg font-bold text-[#C67D3B]">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mt-8 border-t border-[#2A2420] pt-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8C7B70]">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`rounded-xl border p-3 text-center text-xs font-semibold transition ${
                  paymentMethod === "upi"
                    ? "border-[#C67D3B] bg-[#C67D3B]/10 text-[#C67D3B]"
                    : "border-[#2A2420] bg-[#0C0B0A] text-[#8C7B70] hover:border-[#3A322C]"
                }`}
              >
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`rounded-xl border p-3 text-center text-xs font-semibold transition ${
                  paymentMethod === "card"
                    ? "border-[#C67D3B] bg-[#C67D3B]/10 text-[#C67D3B]"
                    : "border-[#2A2420] bg-[#0C0B0A] text-[#8C7B70] hover:border-[#3A322C]"
                }`}
              >
                Credit/Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`rounded-xl border p-3 text-center text-xs font-semibold transition ${
                  paymentMethod === "cash"
                    ? "border-[#C67D3B] bg-[#C67D3B]/10 text-[#C67D3B]"
                    : "border-[#2A2420] bg-[#0C0B0A] text-[#8C7B70] hover:border-[#3A322C]"
                }`}
              >
                Pay at Counter
              </button>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handleProceedToPayment}
            disabled={isProcessing}
            className="mt-6 w-full rounded-xl bg-[#C67D3B] py-4 text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a] disabled:opacity-50"
          >
            {isProcessing ? "Processing Payment..." : `Pay Now • ₹${grandTotal.toLocaleString("en-IN")}`}
          </button>
        </div>
      </div>
    </div>
  )
}