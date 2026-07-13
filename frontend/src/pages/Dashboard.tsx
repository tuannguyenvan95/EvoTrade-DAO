import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, LineChart, Wallet, RefreshCw, 
  CheckCircle2, ChevronLeft, ExternalLink, 
  PieChart as PieChartIcon, Terminal, Activity 
} from 'lucide-react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { AreaChart, Area, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

declare global {
  interface Window {
    ethereum: any;
  }
}

const MOCK_TVL_DATA = [
  { name: 'Mon', value: 1000000 },
  { name: 'Tue', value: 1050000 },
  { name: 'Wed', value: 1030000 },
  { name: 'Thu', value: 1100000 },
  { name: 'Fri', value: 1150000 },
  { name: 'Sat', value: 1210000 },
  { name: 'Sun', value: 1240000 },
];

const ASSET_ALLOCATION = [
  { name: 'ETH', value: 60, color: '#6366f1' },
  { name: 'BTC', value: 30, color: '#f59e0b' },
  { name: 'USDC', value: 10, color: '#10b981' }
];

const MOCK_PROPOSALS = [
  { id: 1, title: 'Rebalance to 60% ETH / 40% BTC', status: 'Passed', votesFor: 12000, votesAgainst: 300 },
  { id: 2, title: 'Stake 100 ETH on Lido', status: 'Active', votesFor: 5400, votesAgainst: 2100 },
  { id: 3, title: 'Execute Flash Loan Arbitrage on Curve', status: 'Active', votesFor: 8900, votesAgainst: 1200 },
  { id: 4, title: 'Upgrade TEE Enclave Security Parameters', status: 'Pending', votesFor: 0, votesAgainst: 0 }
];

const MOCK_EXECUTIONS = [
  { id: '0xabc...123', action: 'Swap 150 ETH to USDC on Uniswap V3', time: '5 mins ago' },
  { id: '0xdef...456', action: 'Stake 500 ETH in Lido', time: '2 hours ago' },
  { id: '0x789...cde', action: 'Rebalance Portfolio (Prop #1)', time: '1 day ago' },
];

const COIN_IDS = 'bitcoin,ethereum,tether,binancecoin,solana,ripple,dogecoin,cardano,avalanche-2,uniswap,chainlink,polkadot';
const COIN_SYMBOLS: Record<string, string> = {
  bitcoin: 'BTC', ethereum: 'ETH', tether: 'USDT', binancecoin: 'BNB', 
  solana: 'SOL', ripple: 'XRP', dogecoin: 'DOGE', cardano: 'ADA', 
  'avalanche-2': 'AVAX', uniswap: 'UNI', chainlink: 'LINK', polkadot: 'DOT'
};

const Dashboard = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<any>({});

  // AI Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    { sender: 'system', text: 'EvoTrade AI Core v2.0 initialized. TEE secured. Ready for queries.' }
  ]);

  // Auto connect or Read-only setup + Polling crypto prices
  useEffect(() => {
    const setupProvider = async () => {
      // Initialize Read-Only Provider for Ritual Testnet
      const provider = new ethers.JsonRpcProvider('https://rpc.ritualfoundation.org');
      console.log("Read-only provider connected to Ritual", await provider.getNetwork());
    };
    setupProvider();

    const fetchPrices = () => {
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true`)
        .then(res => res.json())
        .then(data => setCryptoPrices(data))
        .catch(console.error);
    };
    
    fetchPrices(); // initial fetch
    const interval = setInterval(fetchPrices, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        toast.success('Wallet connected successfully!');
        
        // Switch to Ritual Testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7BB' }], // 1979 in hex
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7BB',
                chainName: 'Ritual Testnet',
                rpcUrls: ['https://rpc.ritualfoundation.org'],
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              }],
            });
          }
        }
      } catch (err) {
        console.error("Wallet connection failed", err);
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('MetaMask is not installed!');
    }
    setIsConnecting(false);
  };

  const handleVote = async (proposalId: number, type: 'for' | 'against') => {
    if (!address) {
      toast.error('Please connect your wallet first!');
      return;
    }

    let toastId;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      toastId = toast.loading('Waiting for wallet signature & gas approval...');
      
      // Sending a 0 ETH transaction to the DAO address (using self as mock) to consume actual Gas
      const tx = await signer.sendTransaction({
        to: address,
        value: 0,
        data: ethers.hexlify(ethers.toUtf8Bytes(`Vote ${type.toUpperCase()} Prop #${proposalId}`))
      });
      
      toast.loading('Transaction submitted. Broadcasting...', { id: toastId });
      
      await tx.wait(); // Wait for blockchain confirmation
      
      toast.dismiss(toastId);
      toast(() => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-emerald-400">Vote registered on-chain!</span>
          <a href={`https://explorer.ritual.net/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1">
            View on Ritual Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ), { duration: 5000, style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
      
      // Update UI Realtime
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: type === 'for' ? p.votesFor + 1000 : p.votesFor,
            votesAgainst: type === 'against' ? p.votesAgainst + 1000 : p.votesAgainst
          };
        }
        return p;
      }));

    } catch (err: any) {
      console.error("Vote Error:", err);
      if (toastId) toast.dismiss(toastId);
      
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected by user.');
      } else if (err.message && err.message.toLowerCase().includes('insufficient funds')) {
        toast.error('Insufficient Testnet ETH for Gas!');
      } else {
        const errorMsg = err.shortMessage || err.message || 'Failed to execute transaction.';
        toast.error(`Failed: ${errorMsg}`);
      }
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const query = terminalInput;
    setTerminalLogs(prev => [...prev, { sender: 'user', text: query }]);
    setTerminalInput('');
    
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, { 
        sender: 'ai', 
        text: `Analyzing "${query}"... Market sentiment is neutral. The TEE currently recommends holding the 60/30/10 allocation strategy.` 
      }]);
    }, 1200);
  };

  const runRandomDemo = () => {
    setIsDemoRunning(true);
    const toastId = toast.loading('TEE executing new AI Debate Cycle...');
    setTimeout(() => {
      toast.success('New AI Strategy Proposal Generated!', { id: toastId });
      setProposals([{ id: proposals.length + 1, title: 'Dynamic AI Generated: Long UNI, Short MKR', status: 'Active', votesFor: 100, votesAgainst: 0 }, ...proposals]);
      setIsDemoRunning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">Dashboard</span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" /> Back to Home
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={runRandomDemo}
              disabled={isDemoRunning}
              className="px-4 py-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isDemoRunning ? 'animate-spin' : ''}`} />
              Random Demo
            </button>
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-6 py-2 bg-white text-slate-900 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      {/* Live Crypto Ticker (Marquee) */}
      <div className="w-full bg-slate-900 border-b border-white/5 py-2 overflow-hidden relative flex items-center group">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[1, 2].map((loopIndex) => (
            <div key={loopIndex} className="flex gap-12 px-6">
              {Object.entries(cryptoPrices).map(([id, data]: [string, any]) => (
                <div key={`${loopIndex}-${id}`} className="flex items-center gap-2 text-xs font-mono shrink-0">
                  <span className="text-slate-400 font-bold">{COIN_SYMBOLS[id]}</span>
                  <span className="text-white">${data?.usd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) || '---'}</span>
                  <span className={data?.usd_24h_change >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {data?.usd_24h_change > 0 ? '+' : ''}{data?.usd_24h_change?.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Allocation */}
        <div className="space-y-6 xl:col-span-1">
          {/* Treasury Stats */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-2 text-slate-400 mb-4 relative z-10">
              <LineChart className="w-5 h-5" />
              <h2 className="font-semibold">Treasury TVL</h2>
            </div>
            <div className="text-4xl font-extrabold text-white mb-2 relative z-10">$1.24M</div>
            <div className="text-sm text-emerald-400 flex items-center gap-1 mb-4 relative z-10">
              <CheckCircle2 className="w-4 h-4" /> +5.2% this week (AI Managed)
            </div>
            <div className="h-24 -mx-6 -mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TVL_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Treasury Allocation (Pie Chart) */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <PieChartIcon className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold">Asset Allocation</h2>
            </div>
            <div className="h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ASSET_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {ASSET_ALLOCATION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs font-semibold mt-2">
              {ASSET_ALLOCATION.map(asset => (
                <div key={asset.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                  <span className="text-slate-300">{asset.name} {asset.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Execution History */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h2 className="font-semibold">Execution History (Live)</h2>
            </div>
            <div className="space-y-4">
              {MOCK_EXECUTIONS.map((exec, i) => (
                <div key={i} className="flex flex-col gap-1 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="text-slate-300 font-medium">{exec.action}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{exec.time}</span>
                    <a href="#" className="text-xs text-indigo-400 font-mono hover:underline">{exec.id}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right Column: Proposals & AI Interaction */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* AI Agent Terminal (Interactive) */}
          <div className="rounded-2xl bg-black border border-indigo-500/30 flex flex-col h-64 overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-indigo-500/20 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-400 tracking-wider">AI AGENT TEE TERMINAL</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 flex flex-col justify-end">
              {terminalLogs.map((log, i) => (
                <div key={i} className={`flex gap-3 ${log.sender === 'user' ? 'text-emerald-400' : log.sender === 'system' ? 'text-slate-500' : 'text-indigo-300'}`}>
                  <span className="shrink-0">{log.sender === 'user' ? '>' : log.sender === 'system' ? '#' : 'Agent:'}</span>
                  <span className="break-words leading-relaxed">{log.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleTerminalSubmit} className="flex gap-2 p-4 pt-0 border-t border-indigo-500/10 mt-2 bg-black/50">
              <span className="text-emerald-400 font-mono text-sm mt-1">{'>'}</span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-emerald-400 font-mono text-sm placeholder:text-emerald-900/50"
                placeholder="Ask the AI agents about market strategy..."
              />
            </form>
          </div>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2 pt-2">
            Active Proposals
          </h2>
          
          <div className="space-y-4">
            {proposals.map((p) => {
              const totalVotes = p.votesFor + p.votesAgainst || 1;
              const forPercent = ((p.votesFor / totalVotes) * 100).toFixed(1);
              const againstPercent = ((p.votesAgainst / totalVotes) * 100).toFixed(1);

              return (
                <div key={p.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-slate-400">ID: #{p.id}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${p.status === 'Active' ? 'bg-blue-500/20 text-blue-400' : p.status === 'Passed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {p.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                    </div>
                    {/* Interactive Vote buttons calling Send Transaction */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleVote(p.id, 'for')}
                        className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-sm font-semibold transition-colors"
                      >
                        Vote FOR
                      </button>
                      <button 
                        onClick={() => handleVote(p.id, 'against')}
                        className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-semibold transition-colors"
                      >
                        Vote AGAINST
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400">For: {p.votesFor.toLocaleString()} ({forPercent}%)</span>
                      <span className="text-red-400">Against: {p.votesAgainst.toLocaleString()} ({againstPercent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${forPercent}%` }} />
                      <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${againstPercent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;
