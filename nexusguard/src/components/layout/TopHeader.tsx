'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, ArrowLeft, Home, Volume2, VolumeX } from 'lucide-react'
import { useAudio } from '@/hooks/useAudio'

export function TopHeader() {
  const router = useRouter()
  const supabase = createClient()

  const { isMuted, toggleMute, playClick } = useAudio()

  const handleSignOut = async () => {
    playClick()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-900/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            playClick()
            router.back()
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm px-2 py-1 rounded-lg hover:bg-gray-800/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button 
          onClick={() => {
            playClick()
            router.push('/dashboard')
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm px-2 py-1 rounded-lg hover:bg-gray-800/50"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <div className="hidden md:block w-px h-4 bg-gray-700 mx-2"></div>
        <div className="hidden md:block text-emerald-400/80 text-sm font-medium border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block mr-2" />
          Arc Network (Testnet)
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            playClick()
            toggleMute()
          }}
          className="p-2 text-gray-400 hover:text-emerald-400 transition-colors rounded-lg hover:bg-gray-800/50"
          title={isMuted ? "Unmute Sounds" : "Mute Sounds"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20 cursor-pointer hover:scale-105 transition-transform">
          Me
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    </header>
  )
}
