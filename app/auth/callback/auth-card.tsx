'use client'

import type React from 'react'

import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Step = 'email' | 'otp'

const OTP_LENGTH = 6

export function AuthCard() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError(null)
    setLoading(true)
    // Simulated send-code request
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
      setTimeout(() => inputsRef.current[0]?.focus(), 50)
    }, 900)
  }

  function handleGoogle() {
    setLoading(true)
    setTimeout(() => setLoading(false), 900)
  }

  function setDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setCode((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus()
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setCode(next)
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputsRef.current[focusIndex]?.focus()
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 900)
  }

  const otpComplete = code.every((d) => d !== '')

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* ambient bronze glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #CD7F32 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md">
        {/* Dev notice */}
        <div
          role="status"
          className="mb-4 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3"
        >
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
            i
          </span>
          <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Dev notice:</span> Authentication is
            simulated. Use any email and enter any 6 digits to preview the sign-in flow.
          </p>
        </div>

        {/* Card */}
        <div
          className="relative rounded-3xl border border-primary/40 bg-card/80 p-8 shadow-2xl backdrop-blur-sm"
          style={{ boxShadow: '0 0 0 1px rgba(205,127,50,0.08), 0 20px 60px -20px rgba(205,127,50,0.35)' }}
        >
          {/* Brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10">
              <span className="font-serif text-xl font-semibold text-primary">M</span>
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              Marigold
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Staff &amp; Customer Portal</p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@marigold.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError(null)
                    }}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    className="h-12 w-full rounded-xl border border-input bg-background/60 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                {emailError && (
                  <p id="email-error" className="text-xs text-destructive">
                    {emailError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/30 transition hover:shadow-primary/50"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Continue to Sign In
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                disabled={loading}
                className="h-12 w-full rounded-xl border-primary/40 bg-transparent text-sm font-medium text-foreground hover:bg-primary/10"
              >
                <GoogleIcon className="size-4" />
                Continue with Google
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                  <ShieldCheck className="size-5 text-primary" aria-hidden />
                </div>
                <h2 className="font-serif text-lg font-semibold text-foreground">Enter your code</h2>
                <p className="text-pretty text-sm text-muted-foreground">
                  We sent a 6-digit code to{' '}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {code.map((digit, i) => (
                  <input
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    aria-label={`Digit ${i + 1}`}
                    className="size-12 rounded-xl border border-input bg-background/60 text-center font-mono text-xl font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40 sm:size-14 sm:text-2xl"
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading || !otpComplete}
                className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/30 transition hover:shadow-primary/50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Verify & Sign In'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setCode(Array(OTP_LENGTH).fill(''))
                }}
                className="mx-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Use a different email
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected by Marigold. By continuing you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </main>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6-2.74-6-6.1s2.69-6.1 6-6.1c1.88 0 3.15.8 3.87 1.5l2.64-2.54C16.9 3.35 14.66 2.4 12 2.4 6.98 2.4 2.9 6.48 2.9 11.5S6.98 20.6 12 20.6c5.28 0 8.77-3.71 8.77-8.94 0-.6-.06-1.06-.15-1.52H12z"
      />
    </svg>
  )
}