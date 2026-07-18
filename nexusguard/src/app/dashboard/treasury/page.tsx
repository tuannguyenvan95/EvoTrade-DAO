'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Loader2, RefreshCw } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function TreasuryPage() {
  const [balance, setBalance] = useState<string>('Loading...')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [userAddress, setUserAddress] = useState<string>('')

  const fetchTransactions = async (address: string, currentBalance: number) => {
    try {
      const res = await fetch(`https://testnet.arcscan.app/api?module=account&action=tokentx&contractaddress=0x3600000000000000000000000000000000000000&address=${address}&page=1&offset=10&sort=desc`)
      const data = await res.json()
      if (data.status === "1" && data.result) {
        setTransactions(data.result)
        
        let runningBalance = currentBalance;
        const history = [];
        history.push({ name: 'Now', balance: runningBalance });

        for (let i = 0; i < data.result.length; i++) {
          const tx = data.result[i];
          const isReceive = tx.to.toLowerCase() === address.toLowerCase();
          const amount = parseFloat(ethers.formatUnits(tx.value, 6));
          
          if (isReceive) {
            runningBalance -= amount;
          } else {
            runningBalance += amount;
          }
          
          const date = new Date(parseInt(tx.timeStamp) * 1000);
          history.push({
            name: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
            balance: runningBalance > 0 ? runningBalance : 0
          });
        }
        
        setChartData(history.reverse());
      } else {
        setTransactions([])
        setChartData([])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchBalance = async (autoSwitch = false) => {
    try {
      setBalance('Updating...')
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        
        if (accounts.length > 0) {
          const chainId = await ethereum.request({ method: 'eth_chainId' })
          if (chainId.toLowerCase() !== '0x4cef52') {
            setBalance('WRONG NETWORK')
            if (autoSwitch) {
              try {
                await ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: '0x4cef52' }],
                })
              } catch (switchError: any) {
                if (switchError.code === 4902) {
                  try {
                    await ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [{
                        chainId: '0x4cef52',
                        chainName: 'Arc Testnet',
                        nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
                        rpcUrls: ['https://rpc.testnet.arc.network'],
                        blockExplorerUrls: ['https://testnet.arcscan.app'],
                      }]
                    })
                  } catch (e) {
                    console.error(e)
                  }
                }
              }
            }
            return
          }

          const provider = new ethers.BrowserProvider(ethereum)
          const usdcAddress = "0x3600000000000000000000000000000000000000";
          const usdcAbi = [{
            "constant": true,
            "inputs": [{ "name": "_owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "type": "function"
          }];
          const contract = new ethers.Contract(usdcAddress, usdcAbi, provider);
          
          const rawBalance = await contract.balanceOf(accounts[0]);
          // USDC ERC-20 uses 6 decimals
          const formatted = ethers.formatUnits(rawBalance, 6)
          const numFormatted = parseFloat(formatted)
          setBalance(numFormatted.toFixed(2) + ' USDC')
          setUserAddress(accounts[0])
          fetchTransactions(accounts[0], numFormatted)
        }
      } else {
        setBalance('0.0000 USDC (No Wallet)')
      }
    } catch (err) {
      console.error("Failed to fetch balance:", err)
      setBalance('Error fetching')
    }
  }

  // Fetch real balance from MetaMask
  useEffect(() => {
    fetchBalance(false)

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      eth.on('accountsChanged', () => fetchBalance(false));
      eth.on('chainChanged', () => fetchBalance(false));
    }

    return () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const eth = (window as any).ethereum;
        eth.removeListener('accountsChanged', () => fetchBalance(false));
        eth.removeListener('chainChanged', () => fetchBalance(false));
      }
    }
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
        
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        
        const usdcAddress = "0x3600000000000000000000000000000000000000";
        const usdcAbi = [{
          "constant": false,
          "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
          ],
          "name": "transfer",
          "outputs": [{ "name": "", "type": "bool" }],
          "type": "function"
        }];
        const contract = new ethers.Contract(usdcAddress, usdcAbi, signer);

        // USDC uses 6 decimals
        const txAmount = ethers.parseUnits(amount, 6)
        
        const tx = await contract.transfer(recipient, txAmount)
        await tx.wait() // wait for confirmation
        
        alert(`Giao dịch gửi đi thành công!\nTxHash: ${tx.hash}`)
        setRecipient('')
        setAmount('')
        fetchBalance() // auto refresh after sending
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
        <div className="space-y-6 lg:col-span-1 flex flex-col">
          {/* Quick Send Form */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-sm p-6 relative">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#d4af37]/50" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#d4af37]/50" />
            
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">QUICK SEND</h3>
              <div className="text-[10px] text-[#d4af37] uppercase tracking-widest flex flex-col items-end">
                <span className="flex items-center gap-1">
                  Wallet Balance
                  <button onClick={() => fetchBalance(true)} className="hover:text-white transition-colors" title="Refresh Balance">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </span>
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
                <label className="block text-[10px] text-gray-400 mb-1.5 uppercase tracking-widest">Amount (USDC)</label>
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

          {/* Treasury Chart Real */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-sm p-6 flex-1 flex flex-col relative min-h-[250px]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">BALANCE HISTORY</h3>
            <div className="flex-1 w-full h-full min-h-[200px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} width={40} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0e1a', border: '1px solid #1f2937', borderRadius: '4px', fontSize: '12px' }}
                      itemStyle={{ color: '#d4af37' }}
                    />
                    <Line type="monotone" dataKey="balance" stroke="#d4af37" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#d4af37' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-xs">No data available</div>
              )}
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
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No transactions found</td>
                  </tr>
                ) : transactions.map((tx) => {
                  const isReceive = tx.to.toLowerCase() === userAddress.toLowerCase()
                  const type = isReceive ? 'Receive' : 'Send'
                  const address = isReceive ? tx.from : tx.to
                  const amount = ethers.formatUnits(tx.value, 6)
                  const date = new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()

                  return (
                    <tr key={tx.hash} className="border-b border-gray-800/50 hover:bg-[#d4af37]/5 transition-colors">
                      <td className="py-4 text-gray-400">{date}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-sm border text-[10px] font-bold uppercase tracking-wider ${isReceive ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5' : 'text-[#d4af37] border-[#d4af37]/30 bg-[#d4af37]/5'}`}>
                          {type}
                        </span>
                      </td>
                      <td className="py-4 text-gray-300">{isReceive ? 'Received USDC' : 'Sent USDC'}</td>
                      <td className="py-4 text-gray-500 font-mono text-xs">{address.slice(0,6)}...{address.slice(-4)}</td>
                      <td className={`py-4 text-right font-bold ${isReceive ? 'text-emerald-400' : 'text-gray-300'}`}>
                        {isReceive ? '+' : '-'}{parseFloat(amount).toFixed(2)} USDC
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
