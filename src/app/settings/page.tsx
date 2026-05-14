'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import type { UserProfile, Expense } from '@/types'

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [income, setIncome] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const [profileRes, expensesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('expenses').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
      ])

      if (profileRes.data) {
        const p = profileRes.data as UserProfile
        setProfile(p)
        setName(p.name || '')
        setIncome(p.monthly_income?.toString() || '')
      }

      setExpenses((expensesRes.data || []) as Expense[])
      setLoading(false)
    }

    loadData()
  }, [router, supabase])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    if (!profile) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name,
        monthly_income: parseFloat(income) || null,
      })
      .eq('id', profile.id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setProfile({ ...profile, name, monthly_income: parseFloat(income) || null })
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDeleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setExpenses(expenses.filter((e) => e.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
        <Navbar isAuthenticated />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#2D6A4F', borderTopColor: 'transparent' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
      <Navbar isAuthenticated userName={profile?.name} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Update your profile and manage your account.</p>
        </div>

        {/* Profile form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-400 bg-gray-50 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Monthly take-home income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="2,400"
                  min={0}
                  className="w-full pl-7 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
                />
              </div>
              {income && parseFloat(income) > 0 && (
                <p className="text-xs mt-1" style={{ color: '#2D6A4F' }}>
                  {formatCurrency(parseFloat(income) / 2)} per paycheck (biweekly)
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {saved && (
              <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Profile saved!
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Fixed expenses</h2>
            <span className="text-sm text-gray-400">
              {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}/mo
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">No expenses added yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{expense.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{expense.category} · {expense.recurring ? 'Recurring' : 'One-time'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800">{formatCurrency(expense.amount)}</span>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Delete expense"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Account</h2>
          <p className="text-sm text-gray-500 mb-4">
            Need to sign out on all devices or start fresh?
          </p>
          <button
            onClick={async () => {
              const supabaseClient = createClient()
              await supabaseClient.auth.signOut()
              router.push('/')
            }}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-200 hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
