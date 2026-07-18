'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('All')
  
  const mockJobs = [
    { id: 'job_001', title: 'Smart Contract Audit', amount: '5,000 USDC', status: 'Funded', provider: '0x123...abc', date: 'Oct 24, 2026' },
    { id: 'job_002', title: 'Frontend Dashboard UI', amount: '2,500 USDC', status: 'Submitted', provider: '0x456...def', date: 'Oct 22, 2026' },
    { id: 'job_003', title: 'Subsquid Indexer Setup', amount: '1,200 USDC', status: 'Draft', provider: '--', date: 'Oct 26, 2026' },
    { id: 'job_004', title: 'Security Review Phase 1', amount: '8,000 USDC', status: 'Completed', provider: '0x789...ghi', date: 'Oct 15, 2026' },
  ]

  const tabs = ['All', 'Draft', 'Funded', 'Submitted', 'Completed']

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Funded': return 'text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/30'
      case 'Submitted': return 'text-purple-400 bg-purple-400/10 border-purple-400/30'
      case 'Completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
      case 'Draft': return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-1 text-[#d4af37] uppercase tracking-tight">Jobs & Escrow_</h1>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Manage ERC-8183 job contracts and automated escrows</p>
        </div>
        <Link 
          href="/dashboard/jobs/create"
          className="border border-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Create Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-800 pb-px">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-[#d4af37] text-[#d4af37]' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockJobs.filter(j => activeTab === 'All' || j.status === activeTab).map((job) => (
          <Link href={`/dashboard/jobs/${job.id}`} key={job.id} className="block group">
            <div className="bg-gray-900/40 border border-gray-800 rounded-sm p-5 hover:border-[#d4af37]/50 hover:bg-gray-900/60 transition-all relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-gray-500 group-hover:border-[#d4af37] transition-colors" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-gray-500 group-hover:border-[#d4af37] transition-colors" />
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-gray-500 group-hover:border-[#d4af37] transition-colors" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-gray-500 group-hover:border-[#d4af37] transition-colors" />

              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-1">ID: {job.id}</div>
                  <h3 className="text-lg font-space-grotesk font-bold text-gray-200 group-hover:text-[#d4af37] transition-colors uppercase tracking-tight">{job.title}</h3>
                </div>
                <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest border rounded-sm ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6 border-t border-gray-800 pt-4">
                <div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Budget</div>
                  <div className="font-mono text-gray-300 text-sm">{job.amount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Provider</div>
                  <div className="text-gray-400 font-mono text-sm">{job.provider}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Due Date</div>
                  <div className="text-gray-400 font-mono text-sm">{job.date}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
