'use client'

import { useParams } from 'next/navigation'

export default function JobDetailPage() {
  const params = useParams()
  const id = params.id as string

  // Mock data based on ID
  const job = {
    id,
    title: id === 'job_002' ? 'Frontend Dashboard UI' : 'Smart Contract Audit',
    status: id === 'job_002' ? 'Submitted' : 'Funded',
    amount: '2,500 USDC',
    provider: '0x456...def',
    description: 'Build a stunning Next.js App Router dashboard using Tailwind CSS. Must include dark mode glassmorphism elements and responsive charts.',
    requirements: ['Next.js 15 App Router', 'Tailwind CSS', 'Framer Motion', 'Fully Responsive'],
    createdAt: 'Oct 20, 2026',
    deadline: 'Oct 28, 2026'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${job.status === 'Submitted' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
              {job.status}
            </span>
          </div>
          <p className="text-gray-400">Job ID: {job.id} • ERC-8183 Escrow Contract</p>
        </div>
        
        {job.status === 'Submitted' && (
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-purple-500/25 transition-all">
            Trigger AI Validation
          </button>
        )}
        {job.status === 'Funded' && (
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all">
            Submit Deliverable
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Details + Action Area) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4">Job Details</h3>
            <p className="text-gray-300 leading-relaxed mb-6">{job.description}</p>
            
            <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Requirements</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-8">
              {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-800">
              <div>
                <div className="text-xs text-gray-500 mb-1">Budget</div>
                <div className="font-bold text-emerald-400">{job.amount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Provider</div>
                <div className="font-mono text-sm text-gray-300">{job.provider}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Created</div>
                <div className="text-sm text-gray-300">{job.createdAt}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Deadline</div>
                <div className="text-sm text-gray-300">{job.deadline}</div>
              </div>
            </div>
          </div>

          {job.status === 'Submitted' && (
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4">Submitted Deliverable</h3>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
                <p className="text-gray-300 text-sm">GitHub PR: <a href="#" className="text-blue-400 hover:underline">github.com/org/repo/pull/42</a></p>
                <p className="text-gray-300 text-sm mt-2">Vercel Preview: <a href="#" className="text-blue-400 hover:underline">dashboard-preview-x7y.vercel.app</a></p>
              </div>
              <p className="text-gray-400 text-sm">Provider notes: "Completed all requirements. Dark mode works perfectly."</p>
            </div>
          )}
        </div>

        {/* Right Column (Timeline) */}
        <div className="space-y-6">
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-6">Escrow Timeline</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-900 bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  ✓
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-800 bg-gray-800/30">
                  <div className="font-bold text-white mb-1">Created</div>
                  <div className="text-xs text-gray-500">Oct 20, 14:00</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-900 bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  $
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-800 bg-gray-800/30">
                  <div className="font-bold text-white mb-1">Funded Escrow</div>
                  <div className="text-xs text-gray-500">Oct 21, 09:30</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-900 ${job.status === 'Submitted' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-500'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                  ↑
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-800 bg-gray-800/30">
                  <div className="font-bold text-white mb-1">Submitted</div>
                  <div className="text-xs text-gray-500">{job.status === 'Submitted' ? 'Oct 26, 16:45' : 'Pending'}</div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-900 bg-gray-800 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  🤖
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-800 bg-gray-800/30 opacity-50">
                  <div className="font-bold text-white mb-1">AI Validation</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
