'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'
import ProgressBar from '@/components/ProgressBar'
import { createClient } from '@/lib/supabase'
import { formatCurrency, calculatePerPaycheck } from '@/lib/utils'
import type { UserProfile, Expense, Goal, SplitConfig } from '@/types'

const PIE_COLORS = ['#E76F51', '#F4A261', '#52B788', '#2D6A4F']
const PIE_LABELS = ['Needs', 'Wants', 'Savings', 'Investing']

interface DashboardData {
  profile: UserProfile | null
  expenses: Expense[]
  goals: Goal[]
  splitConfig: SplitConfig | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData>({
    profile: null,
    expenses: [],
    goals: [],
    splitConfig: null,
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const [profileRes, expensesRes, goalsRes, splitRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('expenses').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('split_configs').select('*').eq('user_id', user.id).single(),
      ])

      const profile = profileRes.data as UserProfile | null

      if (!profile?.monthly_income) {
        router.push('/onboarding')
        return
      }

      setData({
        profile,
        expenses: (expensesRes.data || []) as Expense[],
        goals: (goalsRes.data || []) as Goal[],
        splitConfig: splitRes.data as SplitConfig | null,
      })
      setLoading(false)
    }

    loadData()
  }, [router, supabase])

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

  const { profile, expenses, goals, splitConfig } = data
  const monthlyIncome = profile?.monthly_income || 0
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const leftToSplit = monthlyIncome - totalExpenses

  const split = splitConfig || { needs_pct: 50, wants_pct: 20, savings_pct: 20, invest_pct: 10 }

  const pieData = [
    { name: 'Needs', value: Math.round((split.needs_pct / 100) * leftToSplit) },
    { name: 'Wants', value: Math.round((split.wants_pct / 100) * leftToSplit) },
    { name: 'Savings', value: Math.round((split.savings_pct / 100) * leftToSplit) },
    { name: 'Investing', value: Math.round((split.invest_pct / 100) * leftToSplit) },
  ]

  const firstName = profile?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
      <Navbar isAuthenticated userName={profile?.name} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            Hey {firstName}, here&apos;s your money snapshot 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">Monthly income</p>
            <p className="text-3xl font-black" style={{ color: '#2D6A4F' }}>
              {formatCurrency(monthlyIncome)}
            </p>
            <p className="text-xs text-gray-400 mt-1">{formatCurrency(monthlyIncome / 2)} per paycheck</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">Fixed expenses</p>
            <p className="text-3xl font-black" style={{ color: '#F4A261' }}>
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {monthlyIncome > 0 ? Math.round((totalExpenses / monthlyIncome) * 100) : 0}% of income
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">Left to split</p>
            <p
              className="text-3xl font-black"
              style={{ color: leftToSplit >= 0 ? '#2D6A4F' : '#E76F51' }}
            >
              {formatCurrency(leftToSplit)}
            </p>
            <p className="text-xs text-gray-400 mt-1">across 4 categories</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Donut chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Split breakdown</h2>
            {leftToSplit > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '13px' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value, entry) => (
                      <span style={{ color: '#374151', fontSize: '12px' }}>
                        {value} ({(entry.payload as { percent?: number })?.percent !== undefined ? `${Math.round(((entry.payload as { percent?: number }).percent || 0) * 100)}%` : ''})
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex flex-col items-center justify-center text-gray-400">
                <span className="text-4xl mb-3">📊</span>
                <p className="text-sm text-center">Add income to see your split chart</p>
              </div>
            )}
          </div>

          {/* Split amounts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Your allocations</h2>
              <Link
                href="/splitter"
                className="text-xs font-semibold px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: '#2D6A4F' }}
              >
                Adjust →
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Needs', emoji: '🔴', pct: split.needs_pct, color: '#E76F51', bg: '#FFF1EE' },
                { label: 'Wants', emoji: '🟡', pct: split.wants_pct, color: '#F4A261', bg: '#FFF8F0' },
                { label: 'Savings', emoji: '🟢', pct: split.savings_pct, color: '#52B788', bg: '#F0FBF4' },
                { label: 'Investing', emoji: '📈', pct: split.invest_pct, color: '#2D6A4F', bg: '#E8F5EE' },
              ].map(({ label, emoji, pct, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                    style={{ backgroundColor: bg }}
                  >
                    {emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className="text-sm font-bold" style={{ color }}>
                        {formatCurrency(Math.round((pct / 100) * leftToSplit))}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Goal progress</h2>
            <Link
              href="/goals"
              className="text-xs font-semibold px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: '#2D6A4F' }}
            >
              View all →
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl block mb-3">🎯</span>
              <p className="text-gray-500 text-sm mb-4">No goals yet. Set one to stay motivated!</p>
              <Link
                href="/goals"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                Create a goal
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const pct = goal.target_amount > 0
                  ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
                  : 0
                const perPaycheck = calculatePerPaycheck(goal.target_amount, goal.current_amount, goal.target_date)
                return (
                  <div key={goal.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-semibold text-gray-800">{goal.name}</span>
                        <span className="text-xs text-gray-400">
                          {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                        </span>
                      </div>
                      <ProgressBar percentage={pct} showLabel={false} />
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold" style={{ color: '#F4A261' }}>
                        {formatCurrency(perPaycheck)}/check
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Next step card */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)' }}
        >
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Next step</p>
            <h3 className="text-white font-bold text-lg">
              {goals.length === 0
                ? 'Set your first savings goal'
                : 'Check out the Investing 101 guide'}
            </h3>
            <p className="text-white/70 text-sm mt-1">
              {goals.length === 0
                ? 'Even $10/paycheck adds up fast.'
                : 'Learn how to open a Roth IRA in 5 steps.'}
            </p>
          </div>
          <Link
            href={goals.length === 0 ? '/goals' : '/learn'}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-white font-bold text-sm hover:bg-gray-50 transition-colors"
            style={{ color: '#2D6A4F' }}
          >
            Let&apos;s go →
          </Link>
        </div>
      </div>
    </div>
  )
}
