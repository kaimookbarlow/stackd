export interface UserProfile {
  id: string
  email: string
  name: string
  monthly_income: number | null
}

export interface Expense {
  id: string
  user_id: string
  name: string
  amount: number
  category: 'needs' | 'wants' | 'savings' | 'investing'
  recurring: boolean
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string
  created_at: string
}

export interface SplitConfig {
  id: string
  user_id: string
  needs_pct: number
  wants_pct: number
  savings_pct: number
  invest_pct: number
}

export interface SplitAllocation {
  needs: number
  wants: number
  savings: number
  investing: number
}
