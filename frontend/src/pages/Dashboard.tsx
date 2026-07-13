import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, LineChart, Wallet, ShieldCheck, Cpu, RefreshCw, CheckCircle2, ChevronLeft, Database } from 'lucide-react';
import { ethers } from 'ethers';
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

const MOCK_PROPOSALS = [
  { id: 1, title: 'Rebalance to 60% ETH / 40% BTC', status: 'Passed', votesFor: 12000, votesAgainst: 300 },
  { id: 2, title: 'Stake 100 ETH on Lido', status: 'Active', votesFor: 5400, votesAgainst: 2100 },
  { id: 3, title: 'Execute Flash Loan Arbitrage on Curve', status: 'Active', votesFor: 8900, votesAgainst: 1200 },
  { id: 4, title: 'Upgrade TEE Enclave Security Parameters', status: 'Pending', votesFor: 0, votesAgainst: 0 }
];

const MOCK_LOGS = [
  "Agent Alpha (LLM): Market shows bullish divergence on RSI. Recommend LONG ETH.",
  "Agent Beta (LLM): Agree, but macro indicators suggest volatility. Hedge with 10% USDC.",
  "Consensus Reached inside TEE: Rebalance to 60% ETH, 30% BTC, 10% USDC.",
  "Proposal Generated and Sent to DAO."
];

const Dashboard = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Auto connect or Read-only setup
  useEffect(() => {
    const setupProvider = async () => {
      // Initialize Read-Only Provider for Ritual Testnet
      const provider = new ethers.JsonRpcProvider('https://rpc.ritualfoundation.org');
      console.log("Read-only provider connected to Ritual", await provider.getNetwork());
    };
    setupProvider();
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

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const toastId = toast.loading('Waiting for signature...');
      
      // Request signature from wallet
      await signer.signMessage(`EvoTrade DAO: I am voting ${type.toUpperCase()} for Proposal #${proposalId}.`);
      
      toast.loading('Transaction Confirmed. Broadcasting vote...', { id: toastId });
      
      // Simulate Blockchain Transaction Delay
      setTimeout(() => {
        toast.success('Vote successfully registered on Ritual Chain!', { id: toastId });
        
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
      }, 1500);

    } catch (err: any) {
      if (err.code === 4001) {
        toast.error('Signature rejected by user.');
      } else {
        toast.error('Failed to sign transaction.');
      }
    }
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Logs */}
        <div className="space-y-8 lg:col-span-1">
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
            {/* Added TVL Chart from features request */}
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

          {/* AI Agents Status (Added from features request) */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Database className="w-5 h-5 text-purple-400" />
              <h2 className="font-semibold">Agent Fleet Status</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Alpha (Sentiment)
                </div>
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-semibold">Bullish</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Beta (Risk/Macro)
                </div>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded text-xs font-semibold">Neutral</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  Gamma (Quant)
                </div>
                <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded text-xs font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* Top Delegators (Demo) */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold">Top Delegators (Demo)</h2>
            </div>
            <div className="space-y-3">
              {[
                { address: "0x12Fa...9c1A", power: "45,000" },
                { address: "0x88Bb...3b42", power: "32,500" },
                { address: "0xAb71...88F0", power: "28,100" },
                { address: "0x9c33...211E", power: "15,000" }
              ].map((delegator, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <span className="font-mono">{delegator.address}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">{delegator.power} VP</span>
                </div>
              ))}
            </div>
          </div>

          {/* TEE Agent Logs */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-24 h-24 text-indigo-500" />
            </div>
            <div className="flex items-center gap-2 text-indigo-400 mb-6 relative z-10">
              <Cpu className="w-5 h-5" />
              <h2 className="font-semibold">TEE Debate Logs (Live)</h2>
            </div>
            <div className="space-y-4 relative z-10 font-mono text-xs">
              {MOCK_LOGS.map((log, i) => (
                <div key={i} className="flex gap-3 text-slate-300">
                  <span className="text-indigo-500 shrink-0">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Proposals */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
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
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${p.status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {p.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                    </div>
                    {/* Replaced single button with interactive Vote buttons */}
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
