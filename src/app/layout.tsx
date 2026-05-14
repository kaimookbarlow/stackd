import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stackd — Student Money Management',
  description:
    'Stackd helps college students split their income, hit their savings goals, and start investing — in under 5 minutes.',
  keywords: ['student finance', 'budgeting', 'paycheck splitter', 'savings goals', 'investing'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
