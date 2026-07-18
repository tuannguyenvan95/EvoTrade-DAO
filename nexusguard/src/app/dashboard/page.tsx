export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your treasury and agent activity.</p>
      </div>

      {/* Stats Cards Mock */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Balance', value: '$124,500.00', change: '+12.5%' },
          { label: 'Active Jobs', value: '8', change: '+2' },
          { label: 'Agent Actions', value: '1,204', change: '24h' },
          { label: 'Pending Payouts', value: '$4,200.00', change: '3 jobs' }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.label}</h3>
            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-emerald-400 text-sm font-medium">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Treasury Chart Mock Area */}
        <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm h-96 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Treasury Flow</h3>
          <div className="flex-1 bg-gray-800/30 rounded-xl border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
             {/* Fake Chart Lines */}
             <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
             <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,80 Q25,20 50,50 T100,10" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="2" />
             </svg>
             <span className="text-gray-500 text-sm relative z-10">Chart Visualization Component</span>
          </div>
        </div>

        {/* Activity Feed Mock Area */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm h-96 flex flex-col overflow-hidden">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-800/50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-blue-400 mt-1">
                  🤖
                </div>
                <div>
                  <p className="text-sm text-gray-300"><span className="font-semibold text-white">Validation Agent</span> approved deliverable for Job #1042</p>
                  <span className="text-xs text-gray-500">{i * 15} mins ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Status Mock */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-6">Agent Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Escrow', 'Validation', 'Compliance', 'Payment', 'Risk'].map((agent) => (
            <div key={agent} className="p-4 rounded-xl border border-gray-800 bg-gray-800/20 text-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] mx-auto mb-3"></div>
              <div className="text-sm font-medium text-white">{agent} Agent</div>
              <div className="text-xs text-emerald-400 mt-1">Online • 99.9%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
