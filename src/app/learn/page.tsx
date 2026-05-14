import Link from 'next/link'
import Navbar from '@/components/Navbar'

const steps = [
  {
    number: 1,
    emoji: '⏰',
    title: 'Why start investing now',
    subtitle: 'The earlier you start, the richer you get',
    color: '#E76F51',
    bg: '#FFF1EE',
    content: [
      {
        heading: 'Compound interest is the 8th wonder of the world',
        body: 'If you invest $100/month starting at 20 years old, you could have over $350,000 by retirement — even if you never increase the amount. Wait until 30 to start? You might only end up with $170,000. The difference is 10 years of compound growth.',
      },
      {
        heading: 'The math is wild',
        body: 'A $10/paycheck investment (biweekly) is $260/year. At a 7% average annual return, that grows to roughly $65,000 over 40 years — from just $260/year. Starting earlier is literally worth tens of thousands of dollars.',
      },
    ],
    keyTakeaway: 'Start with whatever you can — even $10/month beats $0.',
  },
  {
    number: 2,
    emoji: '🏦',
    title: 'What account to open',
    subtitle: 'A Roth IRA is the best account for most students',
    color: '#F4A261',
    bg: '#FFF8F0',
    content: [
      {
        heading: 'What is a Roth IRA?',
        body: 'A Roth IRA is a tax-advantaged retirement account. You contribute money you\'ve already paid taxes on, and it grows 100% tax-free. When you withdraw it at retirement, you pay no taxes at all. That\'s the deal.',
      },
      {
        heading: 'Why Roth IRA for students specifically?',
        body: 'As a student, you\'re probably in the lowest tax bracket of your life. That makes now the perfect time to put money into a Roth IRA — you pay today\'s low tax rate and never pay taxes on the growth again. The 2024 contribution limit is $7,000/year.',
      },
      {
        heading: 'One rule: you need earned income',
        body: 'You must have earned income (from a job) to contribute to a Roth IRA. The max you can contribute is either $7,000 or your total earned income for the year — whichever is lower.',
      },
    ],
    keyTakeaway: 'Roth IRA = tax-free growth. Open one as soon as you have a job.',
  },
  {
    number: 3,
    emoji: '🖥️',
    title: 'Where to open it',
    subtitle: 'Fidelity or Schwab — both are excellent and free',
    color: '#52B788',
    bg: '#F0FBF4',
    content: [
      {
        heading: 'Fidelity',
        body: 'Fidelity is widely considered the best option for beginners. No account minimums, no fees to open, and they have excellent index funds (FZROX, FXAIX) with 0% expense ratios. Their app is clean and easy to use.',
      },
      {
        heading: 'Charles Schwab',
        body: 'Another excellent choice with no minimums. Their index funds are also very low cost. SWTSX tracks the total US market and has a 0.03% expense ratio.',
      },
      {
        heading: 'Avoid these pitfalls',
        body: 'Skip platforms that charge high fees or commissions. Avoid "robo-advisors" that charge 0.25–0.50% when you can do the same thing for free. Don\'t use apps like Robinhood for retirement accounts — they encourage trading, which is the opposite of what you want.',
      },
    ],
    keyTakeaway: 'Open a Roth IRA at Fidelity.com — it takes about 10 minutes.',
  },
  {
    number: 4,
    emoji: '📦',
    title: 'What to buy',
    subtitle: 'Index funds — the simple, proven strategy',
    color: '#2D6A4F',
    bg: '#E8F5EE',
    content: [
      {
        heading: 'What is an index fund?',
        body: 'An index fund is a single investment that holds hundreds or thousands of stocks automatically. Instead of picking individual companies, you buy a tiny piece of the entire market. When the market grows (which it does, historically ~7% per year), you grow too.',
      },
      {
        heading: 'The recommended funds',
        body: 'For Fidelity: FZROX (Fidelity Zero Total Market Index Fund) — 0% expense ratio, tracks the entire US market. Or FXAIX (0.015% expense ratio, tracks S&P 500). Either is excellent. For Schwab: SWTSX (Total Stock Market Index). Keep it simple — one fund is enough.',
      },
      {
        heading: 'Why not just pick stocks?',
        body: 'Research shows that roughly 90% of professional fund managers fail to beat a simple S&P 500 index fund over 15+ years. If the pros can\'t consistently beat the market, you probably can\'t either. Index funds let you stop trying and just win by default.',
      },
    ],
    keyTakeaway: 'Buy FZROX or FXAIX at Fidelity. Set it and forget it.',
  },
  {
    number: 5,
    emoji: '💡',
    title: 'How much to invest',
    subtitle: 'Start with whatever you can — and automate it',
    color: '#6366F1',
    bg: '#EEF2FF',
    content: [
      {
        heading: 'The Stackd recommendation',
        body: 'We suggest putting at least 10% of your take-home pay toward investing. On a $2,000/month income, that\'s $200/month or $100 per paycheck. Too much? Start with 5% or even $25/paycheck. The amount matters less than the habit.',
      },
      {
        heading: 'Automate contributions',
        body: 'Set up automatic monthly contributions in Fidelity or Schwab. Connect your bank account, pick a date (payday works great), and let it run automatically. You won\'t miss money you never see, and you remove the decision from your plate entirely.',
      },
      {
        heading: 'Increase as you earn more',
        body: 'When you get a raise or a better job, increase your contributions before you get used to the higher income. Most people spend every extra dollar. Investors put some of it to work first. That habit, compounded over decades, is the difference.',
      },
    ],
    keyTakeaway: 'Start with $25/paycheck. Automate it. Increase it when you can.',
  },
]

export default function LearnPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: '#E8F5EE', color: '#2D6A4F' }}
          >
            📈 Investing 101 — for complete beginners
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Start investing today.<br />Even on a student budget.
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Five steps to go from &quot;no idea what I&apos;m doing&quot; to your first index fund purchase.
            No experience needed.
          </p>
        </div>

        {/* Progress overview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
          <div className="flex items-center gap-3">
            {steps.map((step, i) => (
              <div key={step.number} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block w-8 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
            <div className="flex-1 hidden sm:block">
              <p className="text-xs font-medium text-gray-500 text-right">5 steps · ~10 min read</p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Step header */}
              <div className="p-6 sm:p-8" style={{ backgroundColor: step.bg }}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shrink-0"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{step.emoji}</span>
                      <h2 className="text-xl font-black text-gray-900">{step.title}</h2>
                    </div>
                    <p className="text-gray-600 font-medium text-sm">{step.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Step content */}
              <div className="p-6 sm:p-8">
                <div className="space-y-5">
                  {step.content.map((section) => (
                    <div key={section.heading}>
                      <h3 className="font-bold text-gray-900 mb-2">{section.heading}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
                    </div>
                  ))}
                </div>

                {/* Key takeaway */}
                <div
                  className="mt-6 rounded-2xl px-4 py-3 flex items-start gap-2"
                  style={{ backgroundColor: step.bg }}
                >
                  <span className="text-sm font-bold shrink-0" style={{ color: step.color }}>
                    Key takeaway:
                  </span>
                  <span className="text-sm font-medium text-gray-700">{step.keyTakeaway}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-10 rounded-3xl p-8 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)' }}
        >
          <h2 className="text-2xl font-black mb-2">Ready to put a plan in place?</h2>
          <p className="text-white/80 mb-6 text-sm">
            Use the paycheck splitter to figure out how much you can invest each month.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/splitter"
              className="px-6 py-3 rounded-xl bg-white font-bold text-sm hover:bg-gray-50 transition-colors"
              style={{ color: '#2D6A4F' }}
            >
              Open the Paycheck Splitter →
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-3 rounded-xl border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Create a free account
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            <strong>Disclaimer:</strong> This guide is for educational purposes only and is not financial advice.
            Investing involves risk, including the possible loss of principal. Past performance does not
            guarantee future results. Consult a qualified financial advisor for personalized guidance.
          </p>
        </div>
      </div>
    </div>
  )
}
