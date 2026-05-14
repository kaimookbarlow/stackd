'use client'

import { getProgressColor } from '@/lib/utils'

interface ProgressBarProps {
  percentage: number
  label?: string
  showLabel?: boolean
  height?: number
  color?: string
}

export default function ProgressBar({
  percentage,
  label,
  showLabel = true,
  height = 8,
  color,
}: ProgressBarProps) {
  const clampedPct = Math.min(100, Math.max(0, percentage))
  const barColor = color || getProgressColor(clampedPct)

  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold" style={{ color: barColor }}>
            {Math.round(clampedPct)}%
          </span>
        </div>
      )}
      <div
        className="w-full rounded-full bg-gray-100 overflow-hidden"
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={clampedPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedPct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}
