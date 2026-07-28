"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"

type OrderItem = {
  id?: string
  name: string
  price: number
  quantity: number
}

type Order = {
  id: string
  created_at: string
  total_amount: number
  status: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Wait for auth to initialize
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
      if (u) {
        fetchOrders(u.uid)
      } else {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchOrders = async (userId: string) => {
    setLoading(true)
    try {
      // We removed orderBy("created_at", "desc") from the query because Firebase
      // requires a manually created Composite Index for where() + orderBy().
      // Instead, we just fetch the user's orders and sort them locally!
      const q = query(
        collection(db, "orders"),
        where("user_id", "==", userId)
      )
      
      const querySnapshot = await getDocs(q)
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[]
      
      // Sort orders locally (newest first)
      fetchedOrders.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      setOrders(fetchedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  // Helper to color-code order status badges
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "pending"
    if (s === "completed" || s === "delivered" || s === "paid") {
      return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
    }
    if (s === "cancelled" || s === "failed") {
      return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
    }
    return "bg-[#C67D3B]/10 text-[#C67D3B] border-[#C67D3B]/30"
  }

  return (
    <div className="min-h-screen bg-[#0C0B0A] px-4 py-8 text-[#E6E1DC] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Top Header & Navigation */}
        <div className="mb-8 flex flex-col gap-4 border-b border-[#2A2420] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-[#E6E1DC] sm:text-4xl">
              Order History
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-[#C67D3B]">
              Your Culinary Journey with Marigold
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2A2420] bg-[#141210] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#E6E1DC] transition hover:border-[#C67D3B] hover:text-[#C67D3B]"
          >
            <span>← Back to Menu</span>
          </Link>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#2A2420] bg-[#141210] py-20 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C67D3B] border-t-transparent" />
            <p className="mt-4 text-xs font-medium uppercase tracking-widest text-[#8C7B70]">
              Loading your orders...
            </p>
          </div>
        ) : !user ? (
          /* Unauthenticated State */
          <div className="rounded-2xl border border-[#2A2420] bg-[#141210] p-10 text-center sm:p-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#2A2420] bg-[#0C0B0A] text-[#C67D3B]">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#E6E1DC]">
              Authentication Required
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#8C7B70]">
              Please sign in to your account to view your past dining orders, track active requests, and reorder your favorites.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-xl bg-[#C67D3B] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a]"
            >
              Sign In Now
            </Link>
          </div>
        ) : orders.length === 0 ? (
          /* Empty Order State */
          <div className="rounded-2xl border border-[#2A2420] bg-[#141210] p-12 text-center sm:p-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#2A2420] bg-[#0C0B0A] text-[#8C7B70]">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#E6E1DC]">
              No Orders Yet
            </h3>
            <p className="mt-2 text-xs text-[#8C7B70]">
              You haven&apos;t placed any orders with us yet. Explore our exquisite menu to get started!
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-block rounded-xl bg-[#C67D3B] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a]"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          /* Populated Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-[#2A2420] bg-[#141210] transition-all hover:border-[#3A322C] hover:shadow-2xl"
              >
                {/* Card Header: Order Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2420] bg-[#0C0B0A]/50 p-5 text-xs sm:px-6">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <span className="text-[#8C7B70]">Order ID: </span>
                      <span className="font-mono font-bold text-[#E6E1DC]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8C7B70]">Placed On: </span>
                      <span className="text-[#E6E1DC]">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                {/* Card Body: Ordered Items */}
                <div className="divide-y divide-[#2A2420]/60 p-5 sm:px-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#2A2420] bg-[#0C0B0A] font-mono text-xs font-bold text-[#C67D3B]">
                          {item.quantity}
                        </span>
                        <span className="font-medium text-[#E6E1DC]">{item.name}</span>
                      </div>
                      <span className="font-serif font-semibold text-[#E6E1DC]">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Footer: Total Amount */}
                <div className="flex items-center justify-between border-t border-[#2A2420] bg-[#0C0B0A]/30 p-5 sm:px-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7B70]">
                    Total Amount Paid
                  </span>
                  <span className="font-serif text-lg font-bold text-[#C67D3B] sm:text-xl">
                    ₹{Number(order.total_amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}