'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('monthly_income')
        .eq('id', data.user.id)
        .single()

      if (!profile?.monthly_income) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
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
            Your money,<br />finally organized.
          </h2>
          <p className="text-white/80 text-lg">
            Pick up right where you left off — your paycheck plan is waiting.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Monthly split', value: 'Automated' },
            { label: 'Savings goals', value: 'On track' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-2xl p-4">
              <p className="text-white/60 text-xs mb-1">{stat.label}</p>
              <p className="text-white font-bold">{stat.value}</p>
            </div>
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
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-semibold hover:underline" style={{ color: '#2D6A4F' }}>
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-green-600 focus:outline-none transition-colors"
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            <Link href="/splitter" className="hover:text-gray-600 transition-colors">
              Continue without account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
