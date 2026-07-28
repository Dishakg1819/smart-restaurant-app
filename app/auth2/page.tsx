"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PinSetupPage() {
  const router = useRouter()

  const [step, setStep] = useState<"create" | "confirm">("create")
  const [pin, setPin] = useState<string[]>(Array(6).fill(""))
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(6).fill(""))
  const [error, setError] = useState<string>("")
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  // Refs for focusing inputs automatically
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const currentPinState = step === "create" ? pin : confirmPin
  const setCurrentPinState = step === "create" ? setPin : setConfirmPin

  // Auto-focus first input on load or step change
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [step])

  // Handle number input & auto-tabbing
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow numeric inputs

    const newPin = [...currentPinState]
    newPin[index] = value.slice(-1) // Store single digit
    setCurrentPinState(newPin)

    // Auto-advance to next input field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !currentPinState[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Process PIN logic
  const handleNext = () => {
    const enteredPin = currentPinState.join("")

    if (enteredPin.length < 6) {
      setError("Please enter a complete 6-digit PIN.")
      return
    }

    setError("")

    if (step === "create") {
      setStep("confirm")
    } else {
      const originalPin = pin.join("")
      if (enteredPin !== originalPin) {
        setError("PINs do not match. Please try again.")
        setConfirmPin(Array(6).fill(""))
        inputRefs.current[0]?.focus()
        return
      }

      // Save PIN locally or send to backend API
      localStorage.setItem("user_security_pin", originalPin)
      setIsSuccess(true)

      // Redirect to menu or dashboard after a short delay
      setTimeout(() => {
        router.push("/menu")
      }, 1500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C0B0A] px-4 text-[#E6E1DC]">
      <div className="w-full max-w-md rounded-2xl border border-[#2A2420] bg-[#141210] p-8 shadow-2xl">
        
        {/* Header Icon & Title */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C67D3B]/10 border border-[#C67D3B]/30 text-[#C67D3B]">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#E6E1DC]">
            {isSuccess
              ? "Security PIN Set!"
              : step === "create"
              ? "Set Security PIN"
              : "Confirm Your PIN"}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-wider text-[#8C7B70]">
            {isSuccess
              ? "Your account is secure. Redirecting..."
              : step === "create"
              ? "Enter a 6-digit PIN for quick app access"
              : "Re-enter your 6-digit PIN to verify"}
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <div className="my-8 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 p-4 text-center text-xs font-bold text-[#10B981]">
            ✓ PIN saved successfully! Redirecting to menu...
          </div>
        ) : (
          <>
            {/* PIN Input Grid */}
            <div className="my-8 flex justify-center gap-2 sm:gap-3">
              {currentPinState.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 w-11 rounded-xl border border-[#2A2420] bg-[#0C0B0A] text-center font-serif text-xl font-bold text-[#E6E1DC] focus:border-[#C67D3B] focus:outline-none focus:ring-1 focus:ring-[#C67D3B] sm:h-14 sm:w-12"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="mb-4 text-center text-xs font-semibold text-[#EF4444]">
                {error}
              </p>
            )}

            {/* Submit / Step Button */}
            <button
              onClick={handleNext}
              className="w-full rounded-xl bg-[#C67D3B] py-3.5 text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a]"
            >
              {step === "create" ? "Continue" : "Confirm PIN"}
            </button>

            {/* Back Button for Confirmation Step */}
            {step === "confirm" && (
              <button
                onClick={() => {
                  setStep("create")
                  setConfirmPin(Array(6).fill(""))
                  setError("")
                }}
                className="mt-3 w-full text-center text-xs text-[#8C7B70] hover:text-[#E6E1DC]"
              >
                ← Back to set PIN
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}