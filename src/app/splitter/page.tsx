'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'
import SplitSliders from '@/components/SplitSliders'
import SummaryCard from '@/components/SummaryCard'
import { formatCurrency } from '@/lib/utils'

interface Expense {
  id: string
  name: string
  amount: string
}

interface Splits {
  needs: number
  wants: number
  savings: number
  investing: number
}

type Step = 1 | 2 | 3

export default function SplitterPage() {
  const [step, setStep] = useState<Step>(1)
  const [income, setIncome] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: '', amount: '' },
  ])
  const [splits, setSplits] = useState<Splits>({
    needs: 50,
    wants: 20,
    savings: 20,
    investing: 10,
  })

  const monthlyIncome = parseFloat(income) || 0
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  const leftToSplit = monthlyIncome - totalExpenses

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now().toString(), name: '', amount: '' }])
  }

  const removeExpense = (id: string) => {
    if (expenses.length === 1) return
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const updateExpense = (id: string, field: 'name' | 'amount', value: string) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const goToStep2 = () => {
    if (monthlyIncome <= 0) return
    setStep(2)
  }

  const goToResults = () => {
    setStep(3)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Paycheck Splitter
          </h1>
          <p className="text-gray-500">
            See exactly where your money should go — in 3 steps.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all"
                style={{
                  backgroundColor: step >= s ? '#2D6A4F' : '#E5E7EB',
                  color: step >= s ? 'white' : '#9CA3AF',
                }}
              >
                {step > s ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              <span className="text-sm font-medium text-gray-600 hidden sm:block">
                {s === 1 ? 'Income' : s === 2 ? 'Fixed Expenses' : 'Your Split'}
              </span>
              {s < 3 && (
                <div className="flex-1 h-0.5 rounded-full ml-2" style={{ backgroundColor: step > s ? '#2D6A4F' : '#E5E7EB' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="mb-6">
              <div className="text-4xl mb-3">💰</div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                What&apos;s your monthly take-home?
              </h2>
              <p className="text-gray-500 text-sm">
                After taxes and deductions — what actually hits your bank account each month.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly take-home income
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">
                  $
                </span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="2,400"
                  min={0}
                  className="w-full pl-8 pr-4 py-4 text-xl font-bold text-gray-900 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
                  style={{ '--tw-ring-color': '#2D6A4F' } as React.CSSProperties}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && monthlyIncome > 0) goToStep2()
                  }}
                  autoFocus
                />
              </div>
              {monthlyIncome > 0 && (
                <p className="text-sm mt-2" style={{ color: '#2D6A4F' }}>
                  {formatCurrency(monthlyIncome)}/month → {formatCurrency(monthlyIncome / 2)}/paycheck (biweekly)
                </p>
              )}
            </div>

            <button
              onClick={goToStep2}
              disabled={monthlyIncome <= 0}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              Next: Add expenses →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="mb-6">
              <div className="text-4xl mb-3">🧾</div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                What are your fixed expenses?
              </h2>
              <p className="text-gray-500 text-sm">
                Rent, utilities, phone bill — things you pay every month no matter what.
              </p>
            </div>

            {/* Income summary */}
            <div
              className="flex items-center justify-between rounded-2xl px-4 py-3 mb-6"
              style={{ backgroundColor: '#F0FBF4' }}
            >
              <span className="text-sm font-medium text-gray-600">Monthly income</span>
              <span className="font-bold" style={{ color: '#2D6A4F' }}>
                {formatCurrency(monthlyIncome)}
              </span>
            </div>

            {/* Expenses list */}
            <div className="space-y-3 mb-4">
              {expenses.map((expense, idx) => (
                <div key={expense.id} className="flex gap-2">
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                    placeholder={`Expense ${idx + 1} (e.g. Rent)`}
                    className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:border-green-500 focus:outline-none transition-colors placeholder:text-gray-300"
                  />
                  <div className="relative w-32 shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                      placeholder="0"
                      min={0}
                      className="w-full pl-6 pr-3 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    disabled={expenses.length === 1}
                    className="p-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 text-sm font-semibold mb-6 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ color: '#2D6A4F' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add another expense
            </button>

            {/* Summary */}
            <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total fixed expenses</span>
                <span className="font-semibold text-gray-800">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Left to split</span>
                <span
                  className="font-bold"
                  style={{ color: leftToSplit >= 0 ? '#2D6A4F' : '#E76F51' }}
                >
                  {formatCurrency(leftToSplit)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-4 rounded-2xl font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={goToResults}
                className="flex-1 py-4 rounded-2xl text-white font-bold text-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                See my split →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Results */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Your Money Split</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on {formatCurrency(leftToSplit)} available after fixed expenses
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors border border-gray-200 rounded-lg px-2 py-1"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-xs font-medium text-gray-500">Monthly income</span>
                  <span className="font-bold text-gray-900">{formatCurrency(monthlyIncome)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-xs font-medium text-gray-500">Fixed expenses</span>
                  <span className="font-bold text-gray-900">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SummaryCard
                  label="Needs"
                  amount={Math.round((splits.needs / 100) * leftToSplit)}
                  percentage={splits.needs}
                  color="#E76F51"
                  bgColor="#FFF1EE"
                  emoji="🔴"
                  description="Bills, rent, food"
                />
                <SummaryCard
                  label="Wants"
                  amount={Math.round((splits.wants / 100) * leftToSplit)}
                  percentage={splits.wants}
                  color="#F4A261"
                  bgColor="#FFF8F0"
                  emoji="🟡"
                  description="Fun money"
                />
                <SummaryCard
                  label="Savings"
                  amount={Math.round((splits.savings / 100) * leftToSplit)}
                  percentage={splits.savings}
                  color="#52B788"
                  bgColor="#F0FBF4"
                  emoji="🟢"
                  description="Emergency + goals"
                />
                <SummaryCard
                  label="Investing"
                  amount={Math.max(10, Math.round((splits.investing / 100) * leftToSplit))}
                  percentage={splits.investing}
                  color="#2D6A4F"
                  bgColor="#E8F5EE"
                  emoji="📈"
                  description="Roth IRA, index funds"
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-1">Customize your split</h3>
              <p className="text-sm text-gray-500 mb-5">Drag to adjust — must add up to 100%</p>
              <SplitSliders
                splits={splits}
                onChange={setSplits}
                income={leftToSplit}
              />
            </div>

            {/* CTA */}
            <div
              className="rounded-3xl p-8 text-center text-white"
              style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)' }}
            >
              <h3 className="text-2xl font-black mb-2">Save your plan</h3>
              <p className="text-white/80 mb-6 text-sm">
                Sign up to save this split, track your goals, and get the full dashboard.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white font-bold hover:bg-gray-50 transition-colors"
                style={{ color: '#2D6A4F' }}
              >
                Sign up free → Save your plan
              </Link>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Start over
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
