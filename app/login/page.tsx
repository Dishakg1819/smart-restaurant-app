"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Handle standard login submit -> Redirect to /menu
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/menu")
    }, 1000)
  }

  // Handle Google OAuth Sign-In -> Redirect to /menu
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user) {
        router.push("/menu")
      }
    } catch (error: any) {
      console.error("Google sign in error:", error)
      alert("Failed to sign in with Google: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C0B0A] px-4 text-[#E6E1DC]">
      <div className="w-full max-w-md rounded-2xl border border-[#2A2420] bg-[#141210] p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold tracking-wide text-[#E6E1DC]">
            Welcome Back
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-[#C67D3B]">
            Smart Restaurant Management
          </p>
        </div>

        {/* Google Sign-In Button */}
        <div className="mt-8">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#2A2420] bg-[#0C0B0A] py-3 text-xs font-semibold text-[#E6E1DC] transition hover:border-[#8C7B70] disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-[#2A2420]" />
          <span className="text-[10px] uppercase text-[#8C7B70]">Or</span>
          <div className="h-px flex-1 bg-[#2A2420]" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8C7B70]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 w-full rounded-xl border border-[#2A2420] bg-[#0C0B0A] px-4 py-3 text-xs text-[#E6E1DC] placeholder-[#8C7B70] focus:border-[#C67D3B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8C7B70]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-[#2A2420] bg-[#0C0B0A] px-4 py-3 text-xs text-[#E6E1DC] placeholder-[#8C7B70] focus:border-[#C67D3B] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#C67D3B] py-3.5 text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a] disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}