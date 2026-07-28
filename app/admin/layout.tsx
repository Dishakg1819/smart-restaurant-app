"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // For now, allow all users to access admin KDS for testing since Supabase was removed.
    // In production, implement a Firebase Custom Claim check here.
    setIsAuthorized(true)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0B0A] text-[#E6E1DC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C67D3B] border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-[#8C7B70]">Verifying Admin Credentials...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#E6E1DC]">
      {/* Top Admin Navigation */}
      <header className="border-b border-[#2A2420] bg-[#141210] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-serif text-lg font-bold text-[#C67D3B]">Marigold Management</span>
            <nav className="flex gap-4">
              <Link
                href="/admin/orders"
                className="text-xs font-semibold uppercase tracking-wider text-[#E6E1DC] hover:text-[#C67D3B]"
              >
                Live KDS
              </Link>
              <Link
                href="/admin/menu"
                className="text-xs font-semibold uppercase tracking-wider text-[#E6E1DC] hover:text-[#C67D3B]"
              >
                Menu Admin
              </Link>
            </nav>
          </div>
          <Link
            href="/menu"
            className="text-xs text-[#8C7B70] hover:text-[#E6E1DC]"
          >
            Switch to Customer View →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  )
}