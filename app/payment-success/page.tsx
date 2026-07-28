"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, addDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"

export default function PaymentSuccessPage() {
  const [order, setOrder] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(true)

  useEffect(() => {
    saveOrderToDatabase()
  }, [])

  const saveOrderToDatabase = async () => {
    const rawData = localStorage.getItem("pending_order")
    if (!rawData) {
      setIsSaving(false)
      return
    }

    const orderData = JSON.parse(rawData)
    setOrder(orderData)

    // Wait for auth to initialize before saving
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Save order to Firestore
          await addDoc(collection(db, "orders"), {
            user_id: user.uid,
            total_amount: orderData.grandTotal,
            status: "Paid",
            items: orderData.items,
            created_at: new Date().toISOString(),
            table_number: Math.floor(Math.random() * 20) + 1 // mock table for now
          })
        } catch (e) {
          console.error("Error saving order:", e)
        }
      }
      
      // Clear saved cart after successful payment attempt
      localStorage.removeItem("marigold_cart")
      localStorage.removeItem("pending_order")
      setIsSaving(false)
      
      unsubscribe() // Stop listening after we process the order
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C0B0A] px-4 text-[#E6E1DC]">
      <div className="w-full max-w-md rounded-2xl border border-[#2A2420] bg-[#141210] p-8 text-center shadow-2xl">
        {/* Animated Checkmark Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-serif text-2xl font-bold tracking-wide text-[#E6E1DC]">
          Payment Successful!
        </h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-[#C67D3B]">
          Thank you for dining with Marigold
        </p>

        {isSaving ? (
          <p className="my-6 text-xs text-[#8C7B70]">Recording your order receipt...</p>
        ) : order ? (
          <div className="my-6 rounded-xl border border-[#2A2420] bg-[#0C0B0A] p-4 text-left text-xs">
            <div className="flex justify-between border-b border-[#2A2420] pb-2 text-[#8C7B70]">
              <span>Payment Mode:</span>
              <span className="font-semibold uppercase text-[#E6E1DC]">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#8C7B70]">Amount Paid:</span>
              <span className="font-serif font-bold text-[#C67D3B]">
                ₹{order.grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/orders"
            className="w-full rounded-xl bg-[#C67D3B] py-3.5 text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a]"
          >
            View Order History
          </Link>

          <Link
            href="/menu"
            className="w-full rounded-xl border border-[#2A2420] bg-[#0C0B0A] py-3.5 text-xs font-semibold uppercase tracking-wider text-[#E6E1DC] transition hover:border-[#8C7B70]"
          >
            Return to Menu
          </Link>
        </div>
      </div>
    </div>
  )
}