export default function CompliancePage() {
  const mockInvoices = [
    { id: 'INV-2026-042', job: 'Frontend UI', amount: '$2,500.00', tax: '$0.00', total: '$2,500.00', status: 'Paid', date: 'Oct 26, 2026' },
    { id: 'INV-2026-041', job: 'Audit', amount: '$5,000.00', tax: '$500.00', total: '$5,500.00', status: 'Draft', date: 'Oct 24, 2026' },
    { id: 'INV-2026-040', job: 'Backend API', amount: '$3,200.00', tax: '$0.00', total: '$3,200.00', status: 'Paid', date: 'Oct 20, 2026' },
    { id: 'INV-2026-039', job: 'Design System', amount: '$1,800.00', tax: '$180.00', total: '$1,980.00', status: 'Paid', date: 'Oct 15, 2026' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance & Invoices</h1>
          <p className="text-gray-400">Automated tax rules and invoice generation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invoice Generator */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4">Manual Invoice Generator</h3>
          <p className="text-sm text-gray-400 mb-6">Create a one-off invoice. Taxes will be calculated automatically based on jurisdiction.</p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Provider Address / ID</label>
                <input type="text" className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Jurisdiction</label>
                <select className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-white">
                  <option>United States (US)</option>
                  <option>Vietnam (VN)</option>
                  <option>Singapore (SG)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <input type="text" className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount (USDC)</label>
              <input type="number" className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-white" />
            </div>
            <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-colors mt-2">
              Generate Draft
            </button>
          </form>
        </div>

        {/* Tax Summary */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4">Tax Rules Summary</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-800 bg-gray-800/30">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-white">US Contractors (W-9)</h4>
                <span className="text-emerald-400 text-xs font-bold">Active</span>
              </div>
              <p className="text-sm text-gray-400">0% withholding. Requires W-9 collection before first payment over $600.</p>
            </div>
            
            <div className="p-4 rounded-xl border border-gray-800 bg-gray-800/30">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-white">Vietnam (FCT)</h4>
                <span className="text-emerald-400 text-xs font-bold">Active</span>
              </div>
              <p className="text-sm text-gray-400">10% Foreign Contractor Tax applied to all service payments sent to VN residents.</p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Q4 Tax Liability</span>
                <span className="text-white font-bold">$1,450.00 USDC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-6">Recent Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th className="pb-3 font-medium">Invoice #</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Job / Desc</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Total</th>
                <th className="pb-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                  <td className="py-4 text-white font-medium">{inv.id}</td>
                  <td className="py-4 text-gray-400">{inv.date}</td>
                  <td className="py-4 text-gray-300">{inv.job}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      inv.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10' : 'text-yellow-400 bg-yellow-400/10'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-medium text-white">{inv.total}</td>
                  <td className="py-4 text-center">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Download PDF</button>
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
