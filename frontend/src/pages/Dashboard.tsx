import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, LineChart, Wallet, ShieldCheck, Cpu, RefreshCw, ChevronLeft, ArrowUpRight, Zap, Database } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

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

const INITIAL_PROPOSALS = [
  { id: 1, title: 'Rebalance to 60% ETH / 40% BTC', status: 'Passed', votesFor: 12000, votesAgainst: 300 },
  { id: 2, title: 'Stake 100 ETH on Lido', status: 'Active', votesFor: 5400, votesAgainst: 2100 }
];

const MOCK_LOGS = [
  "Initializing TEE Enclave...",
  "Agent Alpha (LLM): Market shows bullish divergence on RSI. Recommend LONG ETH.",
  "Agent Beta (LLM): Agree, but macro indicators suggest volatility. Hedge with 10% USDC.",
  "Agent Gamma (Quant): On-chain volume supports Alpha's thesis.",
  "Consensus Reached inside TEE: Rebalance to 60% ETH, 30% BTC, 10% USDC.",
  "Proposal Generated and Sent to DAO."
];

const Dashboard = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  useEffect(() => {
    // Simulate TEE logs appearing one by one
    if (activeLogIndex < MOCK_LOGS.length) {
      const timer = setTimeout(() => {
        setActiveLogIndex(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeLogIndex]);

  const connectWallet = async () => {
    setIsConnecting(true);
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        toast.success('Wallet connected successfully!');
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

    const toastId = toast.loading('Waiting for confirmation...');
    
    // Simulate Blockchain Transaction Delay
    setTimeout(() => {
      toast.success('Transaction Confirmed! Vote registered.', { id: toastId });
      
      // Update UI Realtime
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: type === 'for' ? p.votesFor + 100 : p.votesFor,
            votesAgainst: type === 'against' ? p.votesAgainst + 100 : p.votesAgainst
          };
        }
        return p;
      }));
    }, 2000);
  };

  const runRandomDemo = () => {
    setIsDemoRunning(true);
    const toastId = toast.loading('TEE executing new AI Debate Cycle...');
    setActiveLogIndex(0); // Reset logs

    setTimeout(() => {
      toast.success('New AI Strategy Proposal Generated!', { id: toastId });
      setProposals([{ id: proposals.length + 1, title: 'Dynamic Allocation: Long UNI, Short MKR', status: 'Active', votesFor: 100, votesAgainst: 0 }, ...proposals]);
      setIsDemoRunning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black leading-tight">EvoTrade<span className="text-indigo-400">DAO</span></span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" /> Back to Home
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={runRandomDemo}
              disabled={isDemoRunning}
              className="px-5 py-2.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isDemoRunning ? 'animate-spin' : ''}`} />
              Simulate TEE AI Cycle
            </button>
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-200 rounded-xl text-sm font-bold transition-transform active:scale-95 flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <Wallet className="w-4 h-4" />
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Stats & Logs */}
        <div className="space-y-8 xl:col-span-4">
          
          {/* Treasury TVL Chart */}
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2 text-slate-300">
                <LineChart className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold">Treasury TVL</h2>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 24% APY
              </div>
            </div>
            <div className="text-5xl font-black text-white mb-6 relative z-10 tracking-tight">$1.24M</div>
            
            <div className="h-32 -mx-6 -mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TVL_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Agents Status */}
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-slate-300 mb-6">
              <Database className="w-5 h-5 text-purple-400" />
              <h2 className="font-bold">Agent Fleet Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold">Alpha (Sentiment)</span>
                </div>
                <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded">Bullish</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="font-semibold">Beta (Risk/Macro)</span>
                </div>
                <span className="text-blue-400 text-sm font-bold bg-blue-500/10 px-2 py-1 rounded">Neutral</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="font-semibold">Gamma (Quant)</span>
                </div>
                <span className="text-purple-400 text-sm font-bold bg-purple-500/10 px-2 py-1 rounded">Active</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Proposals & TEE Logs */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* TEE Agent Logs */}
          <div className="p-6 rounded-[2rem] bg-[#0A0D14] border border-indigo-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.05)]">
            <div className="absolute -top-10 -right-10 opacity-5 blur-xl">
              <ShieldCheck className="w-64 h-64 text-indigo-500" />
            </div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2 text-indigo-400">
                <Cpu className="w-5 h-5" />
                <h2 className="font-bold text-lg">TEE Debate Sandbox (Live)</h2>
              </div>
              <div className="px-3 py-1 bg-indigo-500/10 rounded-full text-indigo-300 text-xs font-semibold flex items-center gap-2 border border-indigo-500/20">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Secure Enclave
              </div>
            </div>
            <div className="space-y-3 relative z-10 font-mono text-sm min-h-[160px] bg-black/40 p-4 rounded-xl border border-white/5 overflow-hidden">
              {MOCK_LOGS.slice(0, activeLogIndex).map((log, i) => (
                <div key={i} className="flex gap-3 text-slate-300 animate-in fade-in slide-in-from-bottom-2">
                  <span className="text-indigo-500 shrink-0 select-none">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
                  <span className={`${log.includes('Consensus') ? 'text-emerald-400 font-bold' : ''}`}>{log}</span>
                </div>
              ))}
              {activeLogIndex < MOCK_LOGS.length && (
                <div className="flex gap-3 text-slate-500">
                  <span className="text-slate-600">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>
          </div>

          {/* Proposals */}
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" /> Actionable Proposals
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proposals.map((p) => {
                const totalVotes = p.votesFor + p.votesAgainst || 1;
                const forPercent = ((p.votesFor / totalVotes) * 100).toFixed(1);
                const againstPercent = ((p.votesAgainst / totalVotes) * 100).toFixed(1);
                
                return (
                  <div key={p.id} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-400">Proposal #{p.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${p.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                          {p.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-6 leading-snug">{p.title}</h3>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <button 
                          onClick={() => handleVote(p.id, 'for')}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold transition-colors text-sm"
                        >
                          Vote FOR
                        </button>
                        <button 
                          onClick={() => handleVote(p.id, 'against')}
                          className="flex-1 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold transition-colors text-sm"
                        >
                          Vote AGAINST
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-emerald-400">{forPercent}% For</span>
                          <span className="text-red-400">{againstPercent}% Against</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-500 h-full transition-all duration-500 ease-out" style={{ width: `${forPercent}%` }} />
                          <div className="bg-red-500 h-full transition-all duration-500 ease-out" style={{ width: `${againstPercent}%` }} />
                        </div>
                        <div className="text-xs text-slate-500 text-center font-medium mt-2">
                          Total Votes: {totalVotes.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;
