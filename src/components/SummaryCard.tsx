'use client'

import { formatCurrency } from '@/lib/utils'

interface SummaryCardProps {
  label: string
  amount: number
  percentage: number
  color: string
  bgColor: string
  emoji: string
  description?: string
}

export default function SummaryCard({
  label,
  amount,
  percentage,
  color,
  bgColor,
  emoji,
  description,
}: SummaryCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{emoji}</span>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {percentage}%
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-black mt-0.5" style={{ color }}>
          {formatCurrency(amount)}
        </p>
      </div>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  )
}
