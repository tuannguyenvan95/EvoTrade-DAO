'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Loader2 } from 'lucide-react'

export default function TreasuryPage() {
  const [balance, setBalance] = useState<string>('Loading...')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Fetch real balance from MetaMask
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          const provider = new ethers.BrowserProvider((window as any).ethereum)
          const accounts = await provider.send("eth_requestAccounts", [])
          if (accounts.length > 0) {
            const rawBalance = await provider.getBalance(accounts[0])
            // Convert from Wei to ETH/ARC and format to 4 decimal places
            const formatted = parseFloat(ethers.formatEther(rawBalance)).toFixed(4)
            setBalance(formatted + ' ARC')
          }
        } else {
          setBalance('0.0000 ARC (No Wallet)')
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err)
        setBalance('Error fetching')
      }
    }
    fetchBalance()
  }, [])

  const handleQuickSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipient || !amount) return

    setIsSending(true)
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        const from = accounts[0]
        
        // Convert amount to Wei (10^18)
        let txValue = ethers.parseUnits(amount, 18).toString(16) // Convert BigInt to Hex
        txValue = '0x' + txValue

        // Simulate a real Smart Contract call or transfer (requires gas)
        const txHash = await ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: from,
              to: recipient, // Real recipient
              value: txValue,
            },
          ],
        })
        
        alert(`Giao dịch gửi đi thành công!\nTxHash: ${txHash}`)
        setRecipient('')
        setAmount('')
      } else {
        alert("Vui lòng cài đặt ví Web3 (MetaMask)!")
      }
    } catch (error: any) {
      console.error(error)
      alert("Giao dịch thất bại: " + (error.message || "Lỗi không xác định"))
    } finally {
      setIsSending(false)
    }
  }

  const mockTransactions = [
    { id: 'tx_01', date: '2026-10-26 14:30', type: 'Payment', amount: '-2,500.00 USDC', address: '0x456...def', desc: 'Job #002 Payment', hash: '0xabc...123' },
    { id: 'tx_02', date: '2026-10-25 09:15', type: 'Deposit', amount: '+10,000.00 USDC', address: '0x789...ghi', desc: 'Treasury Top-up', hash: '0xdef...456' },
    { id: 'tx_03', date: '2026-10-24 16:45', type: 'Yield', amount: '+12.50 USDC', address: 'Aave V3', desc: 'Lending Yield', hash: '0xghi...789' },
    { id: 'tx_04', date: '2026-10-23 11:20', type: 'Payment', amount: '-1,200.00 USDC', address: '0x123...abc', desc: 'Job #001 Payment', hash: '0xjkl...012' },
  ]

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'Deposit': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
      case 'Withdrawal': return 'text-red-400 border-red-400/30 bg-red-400/5'
      case 'Payment': return 'text-[#d4af37] border-[#d4af37]/30 bg-[#d4af37]/5'
      case 'Yield': return 'text-purple-400 border-purple-400/30 bg-purple-400/5'
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/5'
    }
  }

  const getAmountColor = (amount: string) => {
    return amount.startsWith('+') ? 'text-emerald-400' : 'text-gray-300'
  }

  return (
    <div className="space-y-8 font-mono">
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold text-[#d4af37] uppercase tracking-tight mb-1">Treasury_</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Manage funds, view transactions, and send payments</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Balance', value: '$124,500.00' },
          { label: 'Total Paid (30d)', value: '$18,200.00' },
          { label: 'Total Earned (30d)', value: '$45,000.00' },
          { label: 'Pending Escrow', value: '$8,700.00' }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-sm p-6 relative group hover:border-[#d4af37]/50 transition-colors">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-gray-600 group-hover:border-[#d4af37] transition-colors" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-gray-600 group-hover:border-[#d4af37] transition-colors" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-gray-600 group-hover:border-[#d4af37] transition-colors" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-gray-600 group-hover:border-[#d4af37] transition-colors" />

            <h3 className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">{stat.label}</h3>
            <div className="text-xl font-bold text-gray-200">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Send & Chart */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Send Form */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-sm p-6 relative">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#d4af37]/50" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#d4af37]/50" />
            
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">QUICK SEND</h3>
              <div className="text-[10px] text-[#d4af37] uppercase tracking-widest flex flex-col items-end">
                <span>Wallet Balance</span>
                <span className="font-bold">{balance}</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleQuickSend}>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1.5 uppercase tracking-widest">Recipient Address</label>
                <input 
                  type="text" 
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..." 
                  className="w-full bg-black/50 border border-gray-700 rounded-sm px-4 py-2.5 text-gray-200 focus:outline-none focus:border-[#d4af37] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1.5 uppercase tracking-widest">Amount (ARC/ETH)</label>
                <input 
                  type="number" 
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-black/50 border border-gray-700 rounded-sm px-4 py-2.5 text-gray-200 focus:outline-none focus:border-[#d4af37] transition-colors text-sm"
                />
              </div>
              <button 
                type="submit"
                disabled={isSending}
                className="w-full border border-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 disabled:opacity-50 text-[#d4af37] font-bold py-3 rounded-sm transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-4"
              >
                {isSending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> SENDING...</>
                ) : (
                  'CONFIRM & SEND'
                )}
              </button>
            </form>
          </div>

          {/* Treasury Chart Mock */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-sm p-6 h-64 flex flex-col relative">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">BALANCE HISTORY</h3>
            <div className="flex-1 bg-black/30 border border-gray-800 rounded-sm flex flex-col items-center justify-center relative overflow-hidden">
              {/* Fake grid background for chart */}
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="text-gray-500 text-xs tracking-widest z-10">[CHART_CANVAS_INITIALIZED]</div>
            </div>
          </div>
        </div>

        {/* Right Col: Transactions */}
        <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-sm p-6 flex flex-col relative">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-gray-500" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-gray-500" />

          <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">TRANSACTION HISTORY</h3>
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-[10px] uppercase tracking-widest">
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Type</th>
                  <th className="pb-3 font-bold">Description</th>
                  <th className="pb-3 font-bold">From/To</th>
                  <th className="pb-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-[#d4af37]/5 transition-colors">
                    <td className="py-4 text-gray-400">{tx.date}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-sm border text-[10px] font-bold uppercase tracking-wider ${getTypeStyle(tx.type)}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 text-gray-300">{tx.desc}</td>
                    <td className="py-4 text-gray-500 font-mono text-xs">{tx.address}</td>
                    <td className={`py-4 text-right font-bold ${getAmountColor(tx.amount)}`}>
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
