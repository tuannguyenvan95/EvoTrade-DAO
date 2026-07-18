'use client'

import { useState } from 'react'
import { BlueprintDropdown } from '@/components/ui/BlueprintDropdown'

export default function TeamPage() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Developer')
  const [isInviting, setIsInviting] = useState(false)

  const [mockMembers, setMockMembers] = useState([
    { id: 1, name: 'Alex Rivera', email: 'alex@acmedao.com', role: 'Admin', score: 98, avatar: 'A' },
    { id: 2, name: 'Sam Chen', email: 'sam@acmedao.com', role: 'Developer', score: 92, avatar: 'S' },
    { id: 3, name: 'Taylor Swift', email: 'taylor@acmedao.com', role: 'Designer', score: 88, avatar: 'T' },
    { id: 4, name: 'Jordan Lee', email: 'jordan@acmedao.com', role: 'Treasury', score: 95, avatar: 'J' },
  ])

  const [previewLink, setPreviewLink] = useState<string | null>(null)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsInviting(true)
    setPreviewLink(null)
    
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      })
      const data = await res.json()

      if (data.previewUrl) {
        setPreviewLink(data.previewUrl)
        setMockMembers([...mockMembers, {
          id: Date.now(),
          name: 'Pending Invite...',
          email: email,
          role: role,
          score: 0,
          avatar: '?'
        }])
        setEmail('')
      } else {
        alert("Lỗi: " + (data.error || "Không thể gửi thư."))
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ.")
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-1 text-[#d4af37] uppercase tracking-tight">Team Management_</h1>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Manage your team members and their roles</p>
        </div>
      </div>

      {/* Invite Section */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-sm p-6 relative">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#d4af37]/50" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#d4af37]/50" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#d4af37]/50" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#d4af37]/50" />

        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">Invite New Member</h3>
        <form className="flex flex-col md:flex-row gap-4" onSubmit={handleInvite}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            required
            className="flex-1 bg-black/50 border border-gray-700 rounded-sm px-4 py-2.5 text-gray-200 font-mono text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
          />
          <div className="w-full md:w-48 z-50">
            <BlueprintDropdown 
              options={['Developer', 'Designer', 'Treasury', 'Admin']}
              value={role}
              onChange={setRole}
            />
          </div>
          <button 
            type="submit"
            disabled={isInviting}
            className="border border-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 disabled:opacity-50 text-[#d4af37] px-6 py-2.5 rounded-sm font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isInviting ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
                SENDING...
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                SEND INVITE
              </>
            )}
          </button>
        </form>

        {previewLink && (
          <div className="mt-4 p-4 border border-[#d4af37]/30 bg-[#d4af37]/5 rounded-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[#d4af37] font-bold text-sm uppercase tracking-wide">📧 Email Invitation Sent!</span>
              <span className="text-gray-400 text-xs font-mono mt-1">Một Email thật đã được gửi qua máy chủ SMTP.</span>
            </div>
            <a 
              href={previewLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#d4af37] text-black font-bold text-xs uppercase tracking-widest px-4 py-2 hover:bg-[#b08d20] transition-colors"
            >
              Xem Hộp Thư Đến
            </a>
          </div>
        )}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockMembers.map((member) => (
          <div key={member.id} className="bg-gray-900/40 border border-gray-800 rounded-sm p-5 hover:border-[#d4af37]/50 transition-all relative group">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-gray-500 group-hover:border-[#d4af37] transition-colors" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-gray-500 group-hover:border-[#d4af37] transition-colors" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-gray-500 group-hover:border-[#d4af37] transition-colors" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-gray-500 group-hover:border-[#d4af37] transition-colors" />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-gray-600 flex items-center justify-center text-lg font-space-grotesk font-bold text-gray-300 group-hover:border-[#d4af37] group-hover:text-[#d4af37] transition-colors">
                  {member.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-lg uppercase tracking-tight">{member.name}</h4>
                  <p className="text-gray-500 text-xs font-mono">{member.email}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-gray-800 pt-4">
              <div>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Role</div>
                <span className="font-mono text-gray-300 text-sm">
                  {member.role}
                </span>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Trust Score</div>
                <div className="text-[#d4af37] font-mono text-sm">{member.score}/100</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
