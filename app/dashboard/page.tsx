"use client"

import { useEffect, useState } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function StaffDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("created_at", "desc"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setOrders(ordersData)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching orders:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Staff Operations Dashboard
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Active Orders (Real-time)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm font-semibold text-gray-600 bg-gray-50">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Table Number</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b text-sm hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs text-gray-500">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="p-3 font-medium">Table #{order.table_number || "Takeaway"}</td>
                      <td className="p-3">
                        <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 text-xs rounded-full font-semibold">
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">₹{Number(order.total_amount).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No active orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}