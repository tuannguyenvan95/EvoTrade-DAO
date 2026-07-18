export default function TreasuryPage() {
  const mockTransactions = [
    { id: 'tx_01', date: '2026-10-26 14:30', type: 'Payment', amount: '-2,500.00 USDC', address: '0x456...def', desc: 'Job #002 Payment', hash: '0xabc...123' },
    { id: 'tx_02', date: '2026-10-25 09:15', type: 'Deposit', amount: '+10,000.00 USDC', address: '0x789...ghi', desc: 'Treasury Top-up', hash: '0xdef...456' },
    { id: 'tx_03', date: '2026-10-24 16:45', type: 'Yield', amount: '+12.50 USDC', address: 'Aave V3', desc: 'Lending Yield', hash: '0xghi...789' },
    { id: 'tx_04', date: '2026-10-23 11:20', type: 'Payment', amount: '-1,200.00 USDC', address: '0x123...abc', desc: 'Job #001 Payment', hash: '0xjkl...012' },
    { id: 'tx_05', date: '2026-10-22 10:00', type: 'Withdrawal', amount: '-5,000.00 USDC', address: '0x999...zzz', desc: 'Team Distribution', hash: '0xmno...345' },
    { id: 'tx_06', date: '2026-10-20 08:30', type: 'Deposit', amount: '+15,000.00 USDC', address: '0x789...ghi', desc: 'Initial Funding', hash: '0xpqr...678' },
  ]

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'Deposit': return 'text-green-400 bg-green-400/10'
      case 'Withdrawal': return 'text-red-400 bg-red-400/10'
      case 'Payment': return 'text-blue-400 bg-blue-400/10'
      case 'Yield': return 'text-purple-400 bg-purple-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getAmountColor = (amount: string) => {
    return amount.startsWith('+') ? 'text-green-400' : 'text-white'
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Treasury</h1>
          <p className="text-gray-400">Manage funds, view transactions, and send payments.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Balance', value: '$124,500.00' },
          { label: 'Total Paid (30d)', value: '$18,200.00' },
          { label: 'Total Earned (30d)', value: '$45,000.00' },
          { label: 'Pending Escrow', value: '$8,700.00' }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.label}</h3>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Chart & Send */}
        <div className="space-y-8 lg:col-span-1">
          {/* Send Payment */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4">Quick Send</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
                <input 
                  type="text" 
                  placeholder="0x..." 
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount (USDC)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <button 
                type="button"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Send Payment
              </button>
            </form>
          </div>

          {/* Treasury Chart Mock */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm h-64 flex flex-col">
            <h3 className="text-lg font-bold mb-4">Balance History</h3>
            <div className="flex-1 bg-gray-800/30 rounded-xl border border-gray-700/50 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Chart Placeholder</span>
            </div>
          </div>
        </div>

        {/* Right Col: Transactions */}
        <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold mb-4">Transaction History</h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">From/To</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="py-4 text-gray-300">{tx.date}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeStyle(tx.type)}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 text-gray-300">{tx.desc}</td>
                    <td className="py-4 text-gray-400 font-mono text-xs">{tx.address}</td>
                    <td className={`py-4 text-right font-medium ${getAmountColor(tx.amount)}`}>
                      {tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
