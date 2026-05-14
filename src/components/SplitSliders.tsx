'use client'

import { redistributeSliders } from '@/lib/utils'

interface Splits {
  needs: number
  wants: number
  savings: number
  investing: number
}

interface SplitSlidersProps {
  splits: Splits
  onChange: (splits: Splits) => void
  income: number
}

const SLIDER_CONFIG = [
  {
    key: 'needs' as const,
    label: 'Needs',
    emoji: '🔴',
    description: 'Bills, rent, groceries',
    trackColor: '#E76F51',
    bgColor: '#FFF1EE',
  },
  {
    key: 'wants' as const,
    label: 'Wants',
    emoji: '🟡',
    description: 'Going out, shopping, fun',
    trackColor: '#F4A261',
    bgColor: '#FFF8F0',
  },
  {
    key: 'savings' as const,
    label: 'Savings',
    emoji: '🟢',
    description: 'Emergency fund, goals',
    trackColor: '#52B788',
    bgColor: '#F0FBF4',
  },
  {
    key: 'investing' as const,
    label: 'Investing',
    emoji: '📈',
    description: 'Roth IRA, index funds',
    trackColor: '#2D6A4F',
    bgColor: '#E8F5EE',
  },
]

export default function SplitSliders({ splits, onChange, income }: SplitSlidersProps) {
  const total = splits.needs + splits.wants + splits.savings + splits.investing

  const handleChange = (key: keyof Splits, value: number) => {
    const newSplits = redistributeSliders(splits, key, value)
    onChange(newSplits)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-500">Adjust your split</p>
        <span
          className={`text-sm font-bold px-3 py-1 rounded-full ${
            total === 100 ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'
          }`}
        >
          {total}% total
        </span>
      </div>

      {SLIDER_CONFIG.map(({ key, label, emoji, description, trackColor, bgColor }) => {
        const amount = Math.round((splits[key] / 100) * income)
        return (
          <div key={key} className="rounded-2xl p-4" style={{ backgroundColor: bgColor }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black" style={{ color: trackColor }}>
                  ${amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{splits[key]}%</p>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={splits[key]}
              onChange={(e) => handleChange(key, parseInt(e.target.value))}
              className="w-full"
              style={{
                background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${splits[key]}%, #e5e7eb ${splits[key]}%, #e5e7eb 100%)`,
              }}
            />
          </div>
        )
      })}

      {total !== 100 && (
        <p className="text-sm text-red-500 text-center font-medium">
          Percentages must add up to exactly 100%
        </p>
      )}
    </div>
  )
}
