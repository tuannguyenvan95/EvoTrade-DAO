'use client'

import { useState } from 'react'

export default function TeamPage() {
  const [email, setEmail] = useState('')

  const mockMembers = [
    { id: 1, name: 'Alex Rivera', email: 'alex@acmedao.com', role: 'Admin', score: 98, avatar: 'A' },
    { id: 2, name: 'Sam Chen', email: 'sam@acmedao.com', role: 'Developer', score: 92, avatar: 'S' },
    { id: 3, name: 'Taylor Swift', email: 'taylor@acmedao.com', role: 'Designer', score: 88, avatar: 'T' },
    { id: 4, name: 'Jordan Lee', email: 'jordan@acmedao.com', role: 'Treasury', score: 95, avatar: 'J' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-400">Manage your team members and their roles.</p>
        </div>
      </div>

      {/* Invite Section */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-4">Invite New Member</h3>
        <form className="flex gap-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <select className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-40">
            <option>Developer</option>
            <option>Designer</option>
            <option>Treasury</option>
            <option>Admin</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
            Send Invite
          </button>
        </form>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMembers.map((member) => (
          <div key={member.id} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold shadow-lg">
                  {member.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{member.name}</h4>
                  <p className="text-gray-400 text-sm">{member.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-end mt-6">
              <div>
                <div className="text-xs text-gray-500 mb-1">Role</div>
                <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
                  {member.role}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Trust Score</div>
                <div className="text-emerald-400 font-bold">{member.score}/100</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
