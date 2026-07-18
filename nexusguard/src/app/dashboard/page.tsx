'use client'

import { motion, Variants } from 'framer-motion'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function DashboardPage() {
  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-4xl font-space-grotesk font-bold mb-1 text-[#d4af37] tracking-tight uppercase">Dashboard_</h1>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Global Treasury & Agent Network Status</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs text-gray-500 font-mono uppercase">System Time</div>
          <div className="text-sm text-gray-300 font-mono">2026-07-18 16:23 UTC</div>
        </div>
      </motion.div>

      {/* Stats Cards Blueprint */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Balance', value: '$124,500.00', change: '+12.5%', id: 'SYS-01' },
          { label: 'Active Jobs', value: '8', change: '+2', id: 'JOB-02' },
          { label: 'Agent Actions', value: '1,204', change: '24h', id: 'AGT-03' },
          { label: 'Pending Payouts', value: '$4,200.00', change: '3 jobs', id: 'PAY-04' }
        ].map((stat, i) => (
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            key={i} 
            className="glass glass-hover p-5 rounded-sm flex flex-col justify-between h-32 relative group"
          >
            <div className="absolute top-2 right-2 text-[10px] text-gray-600 font-mono">{stat.id}</div>
            <h3 className="text-gray-400 text-xs font-mono uppercase tracking-wider">{stat.label}</h3>
            <div>
              <div className="text-2xl font-space-grotesk font-bold text-white mb-1 tracking-tight">{stat.value}</div>
              <div className="text-[#d4af37] text-xs font-mono">{stat.change}</div>
            </div>
            {/* Blueprint corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#d4af37]/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#d4af37]/50" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Treasury Chart Blueprint */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass glass-hover p-6 rounded-sm h-[400px] flex flex-col relative group">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#d4af37]/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#d4af37]/50" />
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37]"></span>
              Treasury Flow Analysis
            </h3>
            <div className="text-[10px] text-gray-500 font-mono border border-gray-800 px-2 py-1 rounded-sm bg-gray-900/50">DATA.CHART.01</div>
          </div>
          
          <div className="flex-1 bg-gray-900/40 border border-gray-800 rounded-sm flex items-center justify-center relative overflow-hidden group-hover:border-[#d4af37]/20 transition-colors">
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCA0MGw0MC00MEgwdjQweiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
             
             <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#d4af37]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
             <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <motion.path 
                 d="M0,80 L10,75 L20,78 L30,60 L40,65 L50,45 L60,50 L70,30 L80,35 L90,15 L100,10" 
                 fill="none" 
                 stroke="rgba(212,175,55,0.6)" 
                 strokeWidth="1.5"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, ease: "easeInOut" }}
               />
               <motion.path 
                 d="M0,80 L10,75 L20,78 L30,60 L40,65 L50,45 L60,50 L70,30 L80,35 L90,15 L100,10 L100,100 L0,100 Z" 
                 fill="rgba(212,175,55,0.05)" 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 2, duration: 1 }}
               />
             </svg>
             <span className="text-[#d4af37] text-xs font-mono relative z-10 bg-[#030712]/80 border border-[#d4af37]/30 px-3 py-1.5 rounded-sm">LIVE FEED / STABLE</span>
          </div>
        </motion.div>

        {/* Activity Feed Blueprint */}
        <motion.div variants={itemVariants} className="glass glass-hover p-6 rounded-sm h-[400px] flex flex-col overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#d4af37]/50" />
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></span>
              Agent Logs
            </h3>
            <div className="text-[10px] text-gray-500 font-mono border border-gray-800 px-2 py-1 rounded-sm bg-gray-900/50">LOG.SYS.02</div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex gap-3 items-start pb-3 border-b border-gray-800/50 last:border-0 hover:bg-[#d4af37]/5 p-2 rounded-sm transition-colors cursor-pointer group/log"
              >
                <div className="w-6 h-6 border border-emerald-500/30 bg-emerald-500/10 flex-shrink-0 flex items-center justify-center text-emerald-400 mt-1 text-xs font-mono group-hover/log:border-[#d4af37]/50 group-hover/log:text-[#d4af37]">
                  VA
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-mono leading-relaxed"><span className="text-white">VALIDATOR_AGENT</span> executed <span className="text-[#d4af37]">JOB_#104{i}</span> signature verification.</p>
                  <span className="text-[10px] text-gray-500 font-mono mt-1 block">T - {i * 15}m :: SUCCESS</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Agent Status Blueprint */}
      <motion.div variants={itemVariants} className="glass glass-hover p-6 rounded-sm relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500"></span>
            Agent Cluster Status
          </h3>
          <div className="text-[10px] text-gray-500 font-mono border border-gray-800 px-2 py-1 rounded-sm bg-gray-900/50">NODE.NET.03</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Escrow', 'Validation', 'Compliance', 'Payment', 'Risk'].map((agent) => (
            <motion.div 
              whileHover={{ y: -2 }}
              key={agent} 
              className="p-4 rounded-sm border border-gray-800 bg-gray-900/30 relative group cursor-pointer hover:border-[#d4af37]/30 transition-colors"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-gray-500 group-hover:border-[#d4af37]" />
              <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-gray-500 group-hover:border-[#d4af37]" />
              
              <div className="flex items-center justify-between mb-3">
                <div className="w-2 h-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                <div className="text-[10px] text-gray-600 font-mono">OP_ACTIVE</div>
              </div>
              <div className="text-xs font-mono font-bold text-white uppercase">{agent}</div>
              <div className="text-[10px] text-emerald-400 mt-1 font-mono tracking-widest">99.9% UPTIME</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
