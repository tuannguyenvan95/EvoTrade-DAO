import { TopHeader } from '@/components/layout/TopHeader'
import { Footer } from '@/components/layout/Footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-transparent text-white flex">
      {/* Sidebar - Placeholder until component is implemented */}
      <aside className="fixed w-64 h-screen border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl z-20 hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NexusGuard</h2>
        </div>
        <nav className="px-4 py-6 space-y-2">
          {/* Mock Sidebar Links */}
          {['Dashboard', 'Team', 'Jobs', 'Treasury', 'Agents', 'Compliance'].map((item) => (
            <a key={item} href={`/dashboard${item === 'Dashboard' ? '' : `/${item.toLowerCase()}`}`} className="block px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 flex-1 min-h-screen flex flex-col">
        <TopHeader />

        <div className="p-8 max-w-7xl mx-auto w-full flex-1 space-y-8">
          {children}
        </div>
        
        <Footer />
      </main>
    </div>
  )
}
