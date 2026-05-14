'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
import { formatCurrency } from '@/lib/utils'

interface Expense {
  id: string
  name: string
  amount: string
}

type Step = 1 | 2 | 3

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [income, setIncome] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: '', amount: '' },
  ])
  const [goalName, setGoalName] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [goalDate, setGoalDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)
      setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'there')
      setChecking(false)
    }
    checkAuth()
  }, [router, supabase.auth])

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now().toString(), name: '', amount: '' }])
  }

  const updateExpense = (id: string, field: 'name' | 'amount', value: string) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const removeExpense = (id: string) => {
    if (expenses.length === 1) return
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const handleFinish = async () => {
    if (!userId) return
    setLoading(true)

    const monthlyIncome = parseFloat(income) || 0

    // Update profile with income
    await supabase.from('profiles').upsert({
      id: userId,
      monthly_income: monthlyIncome,
    })

    // Save expenses
    const validExpenses = expenses.filter((e) => e.name && parseFloat(e.amount) > 0)
    if (validExpenses.length > 0) {
      await supabase.from('expenses').insert(
        validExpenses.map((e) => ({
          user_id: userId,
          name: e.name,
          amount: parseFloat(e.amount),
          category: 'needs',
          recurring: true,
        }))
      )
    }

    // Save default split config
    await supabase.from('split_configs').upsert({
      user_id: userId,
      needs_pct: 50,
      wants_pct: 20,
      savings_pct: 20,
      invest_pct: 10,
    })

    // Save goal if provided
    if (goalName && parseFloat(goalAmount) > 0 && goalDate) {
      await supabase.from('goals').insert({
        user_id: userId,
        name: goalName,
        target_amount: parseFloat(goalAmount),
        current_amount: 0,
        target_date: goalDate,
      })
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#2D6A4F', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const monthlyIncome = parseFloat(income) || 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2D6A4F' }}>
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-xl" style={{ color: '#2D6A4F' }}>Stackd</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Hey {userName.split(' ')[0]}! Let&apos;s set you up 👋
          </h1>
          <p className="text-gray-500">Takes about 2 minutes. You can edit everything later.</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div
              key={s}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: step >= s ? '#2D6A4F' : '#E5E7EB' }}
            />
          ))}
        </div>

        {/* Step 1 - Income */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">What&apos;s your monthly income?</h2>
            <p className="text-gray-500 text-sm mb-6">After taxes — what you actually take home each month.</p>

            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">$</span>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="2,400"
                min={0}
                autoFocus
                className="w-full pl-8 pr-4 py-4 text-xl font-bold text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none transition-colors"
                style={{ borderColor: monthlyIncome > 0 ? '#2D6A4F' : '' }}
              />
            </div>

            {monthlyIncome > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#F0FBF4' }}>
                  <p className="text-xs text-gray-500 mb-1">Per paycheck</p>
                  <p className="font-bold" style={{ color: '#2D6A4F' }}>{formatCurrency(monthlyIncome / 2)}</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#FFF8F0' }}>
                  <p className="text-xs text-gray-500 mb-1">Annual</p>
                  <p className="font-bold" style={{ color: '#F4A261' }}>{formatCurrency(monthlyIncome * 12)}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={monthlyIncome <= 0}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2 - Expenses */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="text-4xl mb-4">🧾</div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Any recurring expenses?</h2>
            <p className="text-gray-500 text-sm mb-6">Rent, phone, subscriptions. Skip if you&apos;re not sure yet.</p>

            <div className="space-y-3 mb-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex gap-2">
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                    placeholder="e.g. Rent"
                    className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none transition-colors placeholder:text-gray-300"
                  />
                  <div className="relative w-28 shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                      placeholder="0"
                      min={0}
                      className="w-full pl-6 pr-2 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    disabled={expenses.length === 1}
                    className="p-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addExpense}
              className="flex items-center gap-2 text-sm font-semibold mb-6 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: '#2D6A4F' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add expense
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-2xl font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl text-white font-bold text-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - First Goal */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Create your first goal</h2>
            <p className="text-gray-500 text-sm mb-6">
              What are you saving for? You can add more later. (Optional — skip if you want.)
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Goal name</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Emergency fund, Spring break, New laptop"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors placeholder:text-gray-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      placeholder="1,000"
                      min={0}
                      className="w-full pl-7 pr-3 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target date</label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3.5 rounded-2xl font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                {loading ? 'Setting up...' : "Let's go! 🚀"}
              </button>
            </div>

            <button
              onClick={handleFinish}
              disabled={loading}
              className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip — set up goals later
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
