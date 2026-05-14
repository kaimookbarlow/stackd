'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'
import GoalCard from '@/components/GoalCard'
import { createClient } from '@/lib/supabase'
import type { Goal, UserProfile } from '@/types'

export default function GoalsPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Form state
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const [profileRes, goalsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      if (!profileRes.data?.monthly_income) {
        router.push('/onboarding')
        return
      }

      setProfile(profileRes.data as UserProfile)
      setGoals((goalsRes.data || []) as Goal[])
      setLoading(false)
    }

    loadData()
  }, [router, supabase])

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!goalName.trim()) { setFormError('Goal name is required.'); return }
    if (!targetAmount || parseFloat(targetAmount) <= 0) { setFormError('Target amount must be greater than 0.'); return }
    if (!targetDate) { setFormError('Target date is required.'); return }

    const today = new Date().toISOString().split('T')[0]
    if (targetDate <= today) { setFormError('Target date must be in the future.'); return }

    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        name: goalName.trim(),
        target_amount: parseFloat(targetAmount),
        current_amount: parseFloat(currentAmount) || 0,
        target_date: targetDate,
      })
      .select()
      .single()

    if (error) {
      setFormError(error.message)
      setSaving(false)
      return
    }

    setGoals([data as Goal, ...goals])
    setGoalName('')
    setTargetAmount('')
    setCurrentAmount('')
    setTargetDate('')
    setShowForm(false)
    setSaving(false)
  }

  const handleDeleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (!error) {
      setGoals(goals.filter((g) => g.id !== id))
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

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
      <Navbar isAuthenticated userName={profile?.name} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Your goals</h1>
            <p className="text-gray-500 mt-1">
              {goals.length === 0
                ? 'No goals yet — create your first one below.'
                : `${goals.length} goal${goals.length !== 1 ? 's' : ''} in progress.`}
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setFormError(null) }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#2D6A4F' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New goal
          </button>
        </div>

        {/* Create goal form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Create a new goal</h2>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Goal name
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Emergency fund, Spring break, New MacBook"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors placeholder:text-gray-300 text-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Target amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="1,000"
                      min={1}
                      step={1}
                      className="w-full pl-7 pr-3 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Already saved (optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      placeholder="0"
                      min={0}
                      step={1}
                      className="w-full pl-7 pr-3 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Target date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={minDateStr}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              {formError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setFormError(null) }}
                  className="px-5 py-2.5 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ backgroundColor: '#2D6A4F' }}
                >
                  {saving ? 'Creating...' : 'Create goal'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals grid */}
        {goals.length === 0 && !showForm ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🎯</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No goals yet</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Create your first savings goal. Whether it&apos;s a $500 emergency fund or a spring break trip, every goal starts with one step.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create first goal
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} />
            ))}
          </div>
        )}

        {/* Info card */}
        {goals.length > 0 && (
          <div
            className="mt-8 rounded-2xl p-5 flex items-start gap-3"
            style={{ backgroundColor: '#F0FBF4' }}
          >
            <span className="text-xl mt-0.5">💡</span>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">How per-paycheck is calculated</p>
              <p className="text-sm text-gray-600">
                We assume biweekly paychecks (2 per month). The formula is:
                (target − saved) ÷ months remaining ÷ 2.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
