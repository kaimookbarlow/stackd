'use client'

import { Goal } from '@/types'
import { formatCurrency, calculatePerPaycheck, calculateMonthsUntil } from '@/lib/utils'
import ProgressBar from './ProgressBar'

interface GoalCardProps {
  goal: Goal
  onDelete?: (id: string) => void
}

export default function GoalCard({ goal, onDelete }: GoalCardProps) {
  const percentage = goal.target_amount > 0
    ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
    : 0
  const perPaycheck = calculatePerPaycheck(goal.target_amount, goal.current_amount, goal.target_date)
  const monthsLeft = calculateMonthsUntil(goal.target_date)
  const remaining = goal.target_amount - goal.current_amount

  const targetDateFormatted = new Date(goal.target_date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{goal.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">Target by {targetDateFormatted}</p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Delete goal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-black" style={{ color: '#2D6A4F' }}>
            {formatCurrency(goal.current_amount)}
          </span>
          <span className="text-sm font-medium text-gray-400">
            of {formatCurrency(goal.target_amount)}
          </span>
        </div>
        <ProgressBar percentage={percentage} showLabel={false} height={10} />
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-50">
        <div>
          <p className="text-xs text-gray-500 mb-1">Remaining</p>
          <p className="text-sm font-semibold text-gray-800">{formatCurrency(remaining)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Per paycheck</p>
          <p className="text-sm font-semibold" style={{ color: '#F4A261' }}>
            {formatCurrency(perPaycheck)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Months left</p>
          <p className="text-sm font-semibold text-gray-800">{monthsLeft}mo</p>
        </div>
      </div>

      {percentage >= 100 && (
        <div
          className="mt-4 rounded-xl px-3 py-2 text-center text-sm font-semibold"
          style={{ backgroundColor: '#D8F3DC', color: '#2D6A4F' }}
        >
          Goal reached!
        </div>
      )}
    </div>
  )
}
