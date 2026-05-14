import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2D6A4F' }}>
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="font-black text-xl tracking-tight" style={{ color: '#2D6A4F' }}>
                Stackd
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-semibold text-white px-4 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ backgroundColor: '#D8F3DC', color: '#2D6A4F' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Built for college students
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-6 text-balance">
          Know exactly where your{' '}
          <span style={{ color: '#2D6A4F' }}>paycheck goes.</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 text-balance">
          Stackd helps college students split their income, hit their savings goals, and start
          investing — in under 5 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/splitter"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#2D6A4F' }}
          >
            Try the Paycheck Splitter — Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Create free account
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-4">No credit card. No BS. Just your money, organized.</p>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
              style={{ backgroundColor: '#FFF8F0' }}
            >
              💸
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Paycheck Splitter</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Enter your income, see where every dollar should go. Needs, wants, savings, and investing — automatically calculated.
            </p>
            <Link
              href="/splitter"
              className="inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: '#2D6A4F' }}
            >
              Try it free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
              style={{ backgroundColor: '#F0FBF4' }}
            >
              🎯
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Goal Buckets</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Set savings goals — spring break trip, new laptop, emergency fund — and see exactly how much to set aside each paycheck.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: '#2D6A4F' }}
            >
              Get started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
              style={{ backgroundColor: '#E8F5EE' }}
            >
              📈
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Investing 101</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Never invested before? Our 5-step guide walks you through opening a Roth IRA and buying your first index fund. Simple.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: '#2D6A4F' }}
            >
              Start learning
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-t border-gray-100 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-medium text-gray-400 mb-6">Built for real student budgets</p>
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <p className="text-3xl font-black" style={{ color: '#2D6A4F' }}>5min</p>
              <p className="text-xs text-gray-500 mt-1">to set up your plan</p>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color: '#F4A261' }}>$0</p>
              <p className="text-xs text-gray-500 mt-1">always free to use</p>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color: '#2D6A4F' }}>4 buckets</p>
              <p className="text-xs text-gray-500 mt-1">needs, wants, savings, investing</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div
          className="rounded-3xl p-10 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)' }}
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-3">Ready to get your money right?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Free forever. No hidden fees. No financial jargon.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white font-bold text-lg hover:bg-gray-50 transition-colors"
            style={{ color: '#2D6A4F' }}
          >
            Create your free account
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#2D6A4F' }}>
              <span className="text-white font-black text-xs">S</span>
            </div>
            <span className="font-bold text-gray-700">Stackd</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/splitter" className="hover:text-gray-600 transition-colors">Splitter</Link>
            <Link href="/learn" className="hover:text-gray-600 transition-colors">Learn</Link>
            <Link href="/auth/signup" className="hover:text-gray-600 transition-colors">Sign up</Link>
          </div>
          <p className="text-xs text-gray-400">© 2024 Stackd. Not financial advice.</p>
        </div>
      </footer>
    </div>
  )
}
