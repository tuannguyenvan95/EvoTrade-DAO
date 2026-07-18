'use client'

import { Shield, BrainCircuit, Activity, Clock, Terminal } from 'lucide-react'
import { useState, useEffect } from 'react'
import { BlueprintDropdown } from '@/components/ui/BlueprintDropdown'

export default function TeamPage() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Developer')
  const [isInviting, setIsInviting] = useState(false)

  const [terminalOutput, setTerminalOutput] = useState<string[]>([])

  const [mockMembers, setMockMembers] = useState([
    { id: 1, name: 'Alex Rivera', email: 'alex@acmedao.com', role: 'Admin', score: 98, avatar: 'A', status: 'ACTIVE', wallet: '0x71C...3B9E', agent: 'GUARDIAN NODE', earned: '12,500 USDC' },
    { id: 2, name: 'Sam Chen', email: 'sam@acmedao.com', role: 'Developer', score: 92, avatar: 'S', status: 'SYNCING', wallet: '0x4F2...9A1B', agent: 'VALIDATION NODE', earned: '4,200 USDC' },
    { id: 3, name: 'Taylor Swift', email: 'taylor@acmedao.com', role: 'Designer', score: 88, avatar: 'T', status: 'OFFLINE', wallet: '0x9E1...4C2D', agent: 'STRATEGY NODE', earned: '1,800 USDC' },
    { id: 4, name: 'Jordan Lee', email: 'jordan@acmedao.com', role: 'Treasury', score: 95, avatar: 'J', status: 'ACTIVE', wallet: '0x2D4...7F5A', agent: 'COMPLIANCE NODE', earned: '8,900 USDC' },
  ])

  const [previewLink, setPreviewLink] = useState<string | null>(null)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsInviting(true)
    setPreviewLink(null)
    setTerminalOutput(['[SYS] Initializing secure invite protocol...'])
    
    // Simulate terminal animation
    setTimeout(() => setTerminalOutput(prev => [...prev, '[AUTH] Generating cryptographic zero-knowledge proofs...']), 500)
    setTimeout(() => setTerminalOutput(prev => [...prev, '[NET] Broadcasting node injection request to Swarm...']), 1200)

    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      })
      const data = await res.json()

      if (data.previewUrl) {
        setTimeout(() => {
          setTerminalOutput(prev => [...prev, '[SUCCESS] SMTP relay confirmed. Node injected successfully.'])
          setPreviewLink(data.previewUrl)
          setMockMembers([...mockMembers, {
            id: Date.now(),
            name: 'Pending Invite...',
            email: email,
            role: role,
            score: 0,
            avatar: '?',
            status: 'SYNCING',
            wallet: 'AWAITING...',
            agent: 'ASSIGNING...',
            earned: '0 USDC'
          }])
          setEmail('')
        }, 2000)
        
        setTimeout(() => {
          setIsInviting(false)
          setTerminalOutput([])
        }, 4000)
      } else {
        alert("Lỗi: " + (data.error || "Không thể gửi thư."))
        setIsInviting(false)
        setTerminalOutput([])
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ.")
      setIsInviting(false)
      setTerminalOutput([])
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
                <Terminal className="w-4 h-4 animate-pulse" />
                DEPLOYING...
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                SEND SECURE INVITE
              </>
            )}
          </button>
        </form>

        {/* Terminal Output Simulation */}
        {terminalOutput.length > 0 && (
          <div className="mt-4 p-4 bg-black/60 border border-gray-800 rounded-sm font-mono text-[10px] sm:text-xs space-y-1 h-32 overflow-y-auto">
            {terminalOutput.map((line, idx) => (
              <div key={idx} className={line.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                <span className="text-gray-600 mr-2">{new Date().toISOString().split('T')[1].slice(0,8)}</span> 
                {line}
              </div>
            ))}
          </div>
        )}

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMembers.map((member) => (
          <div key={member.id} className="bg-gray-900/40 border border-gray-800 rounded-sm p-6 hover:border-[#d4af37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all relative group flex flex-col h-full">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-700 group-hover:border-[#d4af37] transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-700 group-hover:border-[#d4af37] transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-700 group-hover:border-[#d4af37] transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-700 group-hover:border-[#d4af37] transition-colors" />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-gray-700 bg-black/50 flex items-center justify-center text-xl font-space-grotesk font-bold text-gray-300 group-hover:border-[#d4af37] group-hover:text-[#d4af37] transition-colors relative">
                  {member.avatar}
                  {/* Status indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-black ${
                    member.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' :
                    member.status === 'SYNCING' ? 'bg-yellow-500 animate-spin' : 'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-lg uppercase tracking-tight">{member.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-gray-500 text-[10px] font-mono">{member.email}</p>
                    <span className="text-gray-700 text-[10px]">•</span>
                    <p className="text-gray-500 text-[10px] font-mono">{member.wallet}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 mt-2">
              <div className="bg-black/30 border border-gray-800 rounded-sm p-3 flex items-center gap-3">
                <BrainCircuit className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                <div>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Agent Overseer</p>
                  <p className="text-xs font-bold text-gray-300 group-hover:text-purple-400 transition-colors uppercase tracking-widest">{member.agent}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 border-t border-gray-800 pt-4">
              <div>
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mb-1 flex items-center gap-1"><Shield className="w-3 h-3"/> Role</div>
                <span className="font-mono text-gray-300 text-[11px] uppercase truncate block">
                  {member.role}
                </span>
              </div>
              <div>
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Score</div>
                <div className="text-[#d4af37] font-mono text-[11px] font-bold">{member.score}/100</div>
              </div>
              <div>
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Paid</div>
                <div className="text-emerald-400 font-mono text-[11px] font-bold truncate block">{member.earned}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
