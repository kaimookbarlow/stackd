'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create profile record
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name,
        monthly_income: null,
      })

      router.push('/onboarding')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAFAF7' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight">Stackd</span>
        </Link>

        <div>
          <h2 className="text-4xl font-black text-white mb-4">
            Get your money right — starting today.
          </h2>
          <p className="text-white/80 text-lg">
            Free forever. Takes 5 minutes. Zero financial jargon.
          </p>
        </div>

        <div className="space-y-3">
          {[
            '✓ Paycheck splitter with smart defaults',
            '✓ Goal tracking with per-paycheck breakdown',
            '✓ Investing 101 guide for beginners',
            '✓ Always 100% free',
          ].map((feature) => (
            <p key={feature} className="text-white/90 text-sm font-medium">
              {feature}
            </p>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2D6A4F' }}>
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-xl tracking-tight" style={{ color: '#2D6A4F' }}>
              Stackd
            </span>
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 mb-8">
            Already have one?{' '}
            <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: '#2D6A4F' }}>
              Log in
            </Link>
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Alex"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-green-600 focus:outline-none transition-colors placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-green-600 focus:outline-none transition-colors placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 8 characters"
                minLength={8}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-green-600 focus:outline-none transition-colors placeholder:text-gray-300"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-opacity disabled:opacity-60 hover:opacity-90"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              {loading ? 'Creating account...' : 'Create free account →'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By signing up, you agree this is a demo app and not financial advice.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
