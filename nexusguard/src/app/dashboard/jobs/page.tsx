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
      case 'Funded': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'Submitted': return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
      case 'Completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      case 'Draft': return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Jobs & Escrow</h1>
          <p className="text-gray-400">Manage ERC-8183 job contracts and automated escrows.</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5">
          + Create Job
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-800 pb-px">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-blue-500 text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockJobs.filter(j => activeTab === 'All' || j.status === activeTab).map((job) => (
          <Link href={`/dashboard/jobs/${job.id}`} key={job.id} className="block group">
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm group-hover:border-blue-500/50 group-hover:bg-gray-900/60 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">ID: {job.id}</div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Budget</div>
                  <div className="font-bold text-gray-200">{job.amount}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Provider</div>
                  <div className="text-gray-300 font-mono text-sm">{job.provider}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Due Date</div>
                  <div className="text-gray-300 text-sm">{job.date}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
