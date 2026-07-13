import React, { useState, useEffect } from 'react';
import { Bot, LineChart, Wallet, ShieldCheck, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ethers } from 'ethers';

// Mock Addresses from Deployment
const CONTRACT_ADDRESSES = {
  token: '0x84bB5b53C299475Adf4Df7ebE7f2B12c68452592',
  dao: '0x08dD1857Ce6f6ae0883C53887B59788D67216be5',
  agent: '0xd8b6305a1A2dA9108C8c33Fa045177f6f4bcc58f'
};

const MOCK_PROPOSALS = [
  { id: 1, title: 'Rebalance to 60% ETH / 40% BTC', status: 'Passed', votesFor: 12000, votesAgainst: 300 },
  { id: 2, title: 'Stake 100 ETH on Lido', status: 'Active', votesFor: 5400, votesAgainst: 2100 }
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
      }
    } else {
      alert('MetaMask is not installed!');
    }
    setIsConnecting(false);
  };

  const runRandomDemo = () => {
    setIsDemoRunning(true);
    setTimeout(() => {
      setProposals([{ id: proposals.length + 1, title: 'Dynamic AI Generated: Long UNI, Short MKR', status: 'Active', votesFor: 100, votesAgainst: 0 }, ...proposals]);
      setIsDemoRunning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Dashboard</span>
          </div>

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
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <LineChart className="w-5 h-5" />
              <h2 className="font-semibold">Treasury TVL</h2>
            </div>
            <div className="text-4xl font-extrabold text-white mb-2">$1.24M</div>
            <div className="text-sm text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> +5.2% this week (AI Managed)
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
            {proposals.map((p) => (
              <div key={p.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-slate-400">ID: #{p.id}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${p.status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {p.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                  </div>
                  <button className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
                    Vote
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">For: {p.votesFor.toLocaleString()}</span>
                    <span className="text-red-400">Against: {p.votesAgainst.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: `${(p.votesFor / (p.votesFor + p.votesAgainst || 1)) * 100}%` }} />
                    <div className="bg-red-500 h-full" style={{ width: `${(p.votesAgainst / (p.votesFor + p.votesAgainst || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
