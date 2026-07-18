import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const viewport: Viewport = {
  themeColor: '#0a0e1a',
}

export const metadata: Metadata = {
  title: 'NexusGuard | Agentic Treasury OS',
  description: 'Autonomous Agentic Compliance & Treasury Operating System on Arc Network',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#0a0e1a] text-white min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
