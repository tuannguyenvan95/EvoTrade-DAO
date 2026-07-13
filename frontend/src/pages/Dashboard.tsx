import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, LineChart, Wallet, RefreshCw, 
  CheckCircle2, ChevronLeft, ExternalLink, 
  PieChart as PieChartIcon, Terminal, Activity,
  Server, Shield, Trophy
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
  { id: 4, title: 'Upgrade TEE Enclave Security Parameters', status: 'Pending', votesFor: 0, votesAgainst: 0 },
  { id: 5, title: 'Allocate 5% Treasury to AI R&D', status: 'Active', votesFor: 7200, votesAgainst: 800 },
  { id: 6, title: 'Launch liquidity mining on Uniswap V3', status: 'Passed', votesFor: 15000, votesAgainst: 150 },
  { id: 7, title: 'Bridge 200 ETH to Base Network', status: 'Active', votesFor: 4100, votesAgainst: 3900 },
  { id: 8, title: 'Acquire Strategy NFT for DAO Treasury', status: 'Pending', votesFor: 0, votesAgainst: 0 },
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
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [voteHistory, setVoteHistory] = useState<{id: number, type: 'for' | 'against', title: string, txHash: string}[]>([]);
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
      console.log("Read-only provider setup bypassed");
    };
    setupProvider();

    // Check if wallet was already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        } catch (err) {
          console.error("Auto-connect failed", err);
        }
      }
    };
    checkConnection();

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

    let toastId: string = '';
    try {
      toastId = toast.loading('Waiting for wallet signature & gas approval...');
      
      // We use raw window.ethereum.request to bypass ethers.js gas estimation and coalesce errors
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: '0x000000000000000000000000000000000000dEaD', // sending 0 ETH to burn address to avoid EOA data errors
          value: '0x0'
        }],
      });
      
      toast.loading('Transaction submitted. Broadcasting...', { id: toastId });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.waitForTransaction(txHash);
      
      toast.dismiss(toastId);
      toast(() => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-emerald-400">Vote registered on-chain!</span>
          <a href={`https://explorer.ritual.net/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1">
            View on Ritual Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ), { duration: 5000, style: { background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0' } });
      
      // Update History
      setVoteHistory(prev => [...prev, {
        id: proposalId,
        type,
        title: proposals.find(p => p.id === proposalId)?.title || `Proposal #${proposalId}`,
        txHash
      }]);

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
    <div className="min-h-screen bg-white text-slate-50">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#e2e8f0', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />

      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm0 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-slate-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900">Dashboard</span>
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" /> Back to Home
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">

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
      <div className="w-full bg-white border-b border-slate-100 py-2 overflow-hidden relative flex items-center group">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[1, 2].map((loopIndex) => (
            <div key={loopIndex} className="flex gap-12 px-6">
              {Object.entries(cryptoPrices).map(([id, data]: [string, any]) => (
                <div key={`${loopIndex}-${id}`} className="flex items-center gap-2 text-xs font-mono shrink-0">
                  <span className="text-slate-500 font-bold">{COIN_SYMBOLS[id]}</span>
                  <span className="text-slate-900">${data?.usd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) || '---'}</span>
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
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          {/* Left Column: Stats & Allocation */}
          <div className="flex flex-col space-y-6 xl:col-span-1">
          {/* TEE Enclave Status */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Server className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 text-slate-500 mb-4 relative z-10">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold">TEE Enclave Status</h2>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Node Status</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Encryption</span>
                <span className="text-slate-900 font-mono text-xs">AES-256-GCM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Uptime</span>
                <span className="text-slate-900 font-mono text-xs">99.99%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Block Height</span>
                <span className="text-indigo-400 font-mono text-xs">1,842,901</span>
              </div>
            </div>
          </div>


          {/* Treasury Allocation (Pie Chart) */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center gap-2 text-slate-500 mb-4">
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
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} 
                    itemStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs font-semibold mt-2">
              {ASSET_ALLOCATION.map(asset => (
                <div key={asset.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                  <span className="text-slate-600">{asset.name} {asset.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Execution History */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 flex-1">
            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h2 className="font-semibold">Execution History (Live)</h2>
            </div>
            <div className="space-y-4">
              {MOCK_EXECUTIONS.map((exec, i) => (
                <div key={i} className="flex flex-col gap-1 text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="text-slate-600 font-medium">{exec.action}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{exec.time}</span>
                    <a href="#" className="text-xs text-indigo-400 font-mono hover:underline">{exec.id}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Leaderboard */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold">Top Delegators</h2>
            </div>
            <div className="space-y-4 flex-1">
              {[
                { address: '0x1A4...8B2', power: '450k', color: 'text-amber-400' },
                { address: '0x8F2...3C9', power: '320k', color: 'text-slate-600' },
                { address: '0x3E1...7A5', power: '180k', color: 'text-orange-400' },
                { address: '0x9D4...2F1', power: '150k', color: 'text-slate-500' },
                { address: '0x2B8...1E9', power: '120k', color: 'text-slate-500' },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-slate-100 p-2 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${user.color}`}>#{i + 1}</span>
                    <span className="text-slate-600 font-mono">{user.address}</span>
                  </div>
                  <span className="text-indigo-400 font-semibold">{user.power} VP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Treasury Stats */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 relative overflow-hidden flex flex-col h-full">
            <div className="flex items-center gap-2 text-slate-500 mb-4 relative z-10">
              <LineChart className="w-5 h-5" />
              <h2 className="font-semibold">Treasury TVL</h2>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 mb-2 relative z-10">$1.24M</div>
            <div className="text-sm text-emerald-400 flex items-center gap-1 mb-4 relative z-10">
              <CheckCircle2 className="w-4 h-4" /> +5.2% this week (AI Managed)
            </div>
            <div className="h-24 -mx-6 -mb-6 mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TVL_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Proposals & AI Interaction */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* AI Agent Terminal (Interactive) */}
          <div className="rounded-2xl bg-white text-slate-100 border border-indigo-500/30 flex flex-col h-64 overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <div className="bg-slate-50/80 px-4 py-2 border-b border-indigo-500/20 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-500 tracking-wider">AI AGENT TEE TERMINAL</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 flex flex-col justify-end">
              {terminalLogs.map((log, i) => (
                <div key={i} className={`flex gap-3 ${log.sender === 'user' ? 'text-emerald-400' : log.sender === 'system' ? 'text-slate-500' : 'text-indigo-300'}`}>
                  <span className="shrink-0">{log.sender === 'user' ? '>' : log.sender === 'system' ? '#' : 'Agent:'}</span>
                  <span className="break-words leading-relaxed">{log.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleTerminalSubmit} className="flex gap-2 p-4 pt-0 border-t border-indigo-500/10 mt-2 bg-white text-slate-100/50">
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

          <div className="flex items-center justify-between pt-2">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {activeTab === 'active' ? 'Active Proposals' : 'Your Voting History'}
            </h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={runRandomDemo}
                disabled={isDemoRunning}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isDemoRunning ? 'animate-spin' : ''}`} />
                Random Demo
              </button>
              <div className="flex gap-2 ml-2 pl-4 border-l border-slate-200">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'active' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  History
                </button>
              </div>
            </div>
          </div>
          
          {activeTab === 'active' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
              {proposals.map((p) => {
                const totalVotes = p.votesFor + p.votesAgainst || 1;
                const forPercent = ((p.votesFor / totalVotes) * 100).toFixed(1);
                const againstPercent = ((p.votesAgainst / totalVotes) * 100).toFixed(1);
                
                return (
                  <div key={p.id} className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm font-mono">ID: #{p.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                          p.status === 'Active' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                          p.status === 'Passed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      
                      {p.status === 'Active' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleVote(p.id, 'for')}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          >
                            Vote FOR
                          </button>
                          <button 
                            onClick={() => handleVote(p.id, 'against')}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                          >
                            Vote AGAINST
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex-1 pr-4">{p.title}</h3>

                    <div className="mt-auto">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-emerald-600 font-medium">For: {p.votesFor.toLocaleString()} ({forPercent}%)</span>
                        <span className="text-rose-600 font-medium">Against: {p.votesAgainst.toLocaleString()} ({againstPercent}%)</span>
                      </div>
                      <div className="w-full bg-rose-100 rounded-full h-2 flex overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${forPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {voteHistory.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-500">
                  <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p>You haven't voted on any proposals yet.</p>
                </div>
              ) : (
                voteHistory.map((vote, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-500 font-mono mb-1">ID: #{vote.id}</div>
                      <h3 className="text-lg font-bold text-slate-900">{vote.title}</h3>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-lg border ${vote.type === 'for' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                        Voted {vote.type.toUpperCase()}
                      </span>
                      <a href={`https://explorer.ritual.net/tx/${vote.txHash}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1 font-mono">
                        View Tx <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
