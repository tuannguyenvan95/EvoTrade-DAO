export default function AgentsPage() {
  const agents = [
    { name: 'Escrow', role: 'Smart Contract Management', status: 'Active', uptime: '99.9%', color: 'blue' },
    { name: 'Validation', role: 'Deliverable QA & Scoring', status: 'Active', uptime: '99.8%', color: 'purple' },
    { name: 'Compliance', role: 'Tax & Regulatory Rules', status: 'Active', uptime: '100%', color: 'emerald' },
    { name: 'Payment', role: 'Fund Disbursement', status: 'Active', uptime: '99.9%', color: 'yellow' },
    { name: 'Risk', role: 'Fraud Detection', status: 'Active', uptime: '99.9%', color: 'red' },
  ]

  const mockActions = [
    { time: '10:45:22', agent: 'Validation', action: 'Approved deliverable score: 95/100', target: 'Job #002', hash: '0xabc...123' },
    { time: '10:45:24', agent: 'Escrow', action: 'Unlocked funds for payment', target: 'Job #002', hash: '0xdef...456' },
    { time: '10:45:25', agent: 'Compliance', action: 'Generated W-9 tax record', target: 'Provider 0x456', hash: '--' },
    { time: '10:45:26', agent: 'Payment', action: 'Executed 2,500 USDC transfer', target: 'Job #002', hash: '0xghi...789' },
    { time: '09:12:05', agent: 'Risk', action: 'Flagged suspicious IP', target: 'Login attempt', hash: '--' },
    { time: '08:30:00', agent: 'Escrow', action: 'Locked 5,000 USDC', target: 'Job #001', hash: '0xjkl...012' },
  ]

  const getAgentColor = (agentName: string) => {
    switch(agentName) {
      case 'Escrow': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'Validation': return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
      case 'Compliance': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      case 'Payment': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'Risk': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Agent Network</h1>
          <p className="text-gray-400">Monitor and configure your autonomous workforce.</p>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium border border-gray-700 transition-colors">
          Register Custom Agent
        </button>
      </div>

      {/* Agents Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {agents.map((agent) => (
          <div key={agent.name} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm text-center hover:border-gray-700 transition-colors">
            <div className="w-12 h-12 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-4 border border-gray-700 relative">
              🤖
              <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
            <h3 className="font-bold text-white">{agent.name}</h3>
            <p className="text-xs text-gray-500 mt-1 mb-3 h-8">{agent.role}</p>
            <div className="text-xs text-gray-400 bg-gray-800/50 py-1 rounded-md">
              Uptime: {agent.uptime}
            </div>
          </div>
        ))}
      </div>

      {/* Action Log */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-6">Real-time Action Log</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th className="pb-3 font-medium w-24">Time</th>
                <th className="pb-3 font-medium w-32">Agent</th>
                <th className="pb-3 font-medium">Action</th>
                <th className="pb-3 font-medium">Target</th>
                <th className="pb-3 font-medium text-right">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono">
              {mockActions.map((action, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                  <td className="py-4 text-gray-500">{action.time}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-sans border ${getAgentColor(action.agent)}`}>
                      {action.agent}
                    </span>
                  </td>
                  <td className="py-4 text-gray-300 font-sans">{action.action}</td>
                  <td className="py-4 text-gray-400">{action.target}</td>
                  <td className="py-4 text-right">
                    {action.hash !== '--' ? (
                      <a href="#" className="text-blue-400 hover:underline">{action.hash}</a>
                    ) : (
                      <span className="text-gray-600">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
