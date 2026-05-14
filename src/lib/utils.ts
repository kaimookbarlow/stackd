export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyDecimal(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateMonthsUntil(targetDate: string): number {
  const now = new Date()
  const target = new Date(targetDate)
  const diffMs = target.getTime() - now.getTime()
  const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44)
  return Math.max(1, Math.ceil(diffMonths))
}

export function calculatePerPaycheck(
  targetAmount: number,
  currentAmount: number,
  targetDate: string
): number {
  const months = calculateMonthsUntil(targetDate)
  const remaining = targetAmount - currentAmount
  // biweekly pay = 2 paychecks per month
  return remaining / months / 2
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function redistributeSliders(
  sliders: { needs: number; wants: number; savings: number; investing: number },
  changedKey: keyof typeof sliders,
  newValue: number
): typeof sliders {
  const updated = { ...sliders, [changedKey]: newValue }
  const otherKeys = (
    Object.keys(sliders) as (keyof typeof sliders)[]
  ).filter((k) => k !== changedKey)

  const remaining = 100 - newValue
  const currentOtherSum = otherKeys.reduce((sum, k) => sum + sliders[k], 0)

  if (currentOtherSum === 0) {
    const share = remaining / otherKeys.length
    otherKeys.forEach((k) => {
      updated[k] = Math.round(share)
    })
  } else {
    let distributed = 0
    otherKeys.forEach((k, i) => {
      if (i === otherKeys.length - 1) {
        updated[k] = remaining - distributed
      } else {
        const proportion = sliders[k] / currentOtherSum
        const val = Math.round(proportion * remaining)
        updated[k] = val
        distributed += val
      }
    })
  }

  return updated
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 75) return '#2D6A4F'
  if (percentage >= 40) return '#F4A261'
  return '#E76F51'
}
