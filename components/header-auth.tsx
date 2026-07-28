"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { User } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function HeaderAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await auth.signOut()
  }

  if (loading) {
    return <div className="ml-2 h-8 w-20 animate-pulse rounded-full bg-[#2A2420]"></div>
  }

  if (user) {
    return (
      <div className="ml-2 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[#2A2420] bg-[#141210] pl-1 pr-3 py-1">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C67D3B] text-[10px] font-bold text-[#0C0B0A]">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-[#E6E1DC]">
            {user.displayName?.split(" ")[0] || "User"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-medium text-[#8C7B70] hover:text-[#E6E1DC] transition"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <Link 
      href="/login" 
      className="ml-2 rounded-full bg-[#C67D3B] px-4 py-1.5 text-sm font-semibold text-[#0C0B0A] hover:bg-[#d88d4a] transition"
    >
      Sign In
    </Link>
  )
}
