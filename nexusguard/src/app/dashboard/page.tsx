'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-gray-400">Overview of your treasury and agent activity.</p>
      </motion.div>

      {/* Stats Cards Mock */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Balance', value: '$124,500.00', change: '+12.5%' },
          { label: 'Active Jobs', value: '8', change: '+2' },
          { label: 'Agent Actions', value: '1,204', change: '24h' },
          { label: 'Pending Payouts', value: '$4,200.00', change: '3 jobs' }
        ].map((stat, i) => (
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            key={i} 
            className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-md shadow-xl shadow-black/50 hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-colors"
          >
            <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.label}</h3>
            <div className="text-3xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
            <div className="text-emerald-400 text-sm font-medium">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Treasury Chart Mock Area */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col hover:border-blue-500/20 transition-colors">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Treasury Flow
          </h3>
          <div className="flex-1 bg-gray-800/30 rounded-xl border border-gray-700/50 flex items-center justify-center relative overflow-hidden group">
             {/* Fake Chart Lines */}
             <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
             <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <motion.path 
                 d="M0,80 Q25,20 50,50 T100,10" 
                 fill="none" 
                 stroke="rgba(59,130,246,0.5)" 
                 strokeWidth="2"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, ease: "easeInOut" }}
               />
             </svg>
             <span className="text-gray-500 text-sm relative z-10 glass px-4 py-2 rounded-lg">Live Analytics</span>
          </div>
        </motion.div>

        {/* Activity Feed Mock Area */}
        <motion.div variants={itemVariants} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col overflow-hidden hover:border-purple-500/20 transition-colors">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            Agent Activity
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex gap-4 items-start pb-4 border-b border-gray-800/50 last:border-0 hover:bg-gray-800/20 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-blue-400 mt-1 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  🤖
                </div>
                <div>
                  <p className="text-sm text-gray-300"><span className="font-semibold text-white">Validation Agent</span> approved deliverable for Job #1042</p>
                  <span className="text-xs text-emerald-400 font-mono mt-1 block">{i * 15} mins ago</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Agent Status Mock */}
      <motion.div variants={itemVariants} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          System Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Escrow', 'Validation', 'Compliance', 'Payment', 'Risk'].map((agent) => (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              key={agent} 
              className="p-4 rounded-xl border border-gray-800 bg-gray-800/20 text-center relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] mx-auto mb-3 animate-pulse"></div>
              <div className="text-sm font-medium text-white">{agent}</div>
              <div className="text-xs text-emerald-400 mt-1 font-mono">Online</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
