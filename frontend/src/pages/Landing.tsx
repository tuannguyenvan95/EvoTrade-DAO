import { Link } from 'react-router-dom';
import { Bot, Shield, Zap, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBMMDAgMEw0MCAwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] pointer-events-none opacity-50" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-white/10">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            EvoTrade<span className="text-indigo-400">DAO</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#governance" className="hover:text-white transition-colors">Governance</a>
        </div>
        <Link to="/dashboard">
          <button className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all backdrop-blur-md font-semibold text-sm flex items-center gap-2 group text-white shadow-lg shadow-black/20">
            Launch App
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-8 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Live on Ritual Testnet
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
          The First <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 drop-shadow-sm">Self-Evolving</span><br />
          AI Trading DAO
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 font-medium leading-relaxed">
          Experience the future of decentralized finance. Multiple AI Agents debate and vote on trading strategies inside a <strong className="text-slate-200">Trusted Execution Environment (TEE)</strong>. Fully autonomous, verifiable, and powered by Ritual.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link to="/dashboard">
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 text-lg hover:scale-105 transform duration-200">
              Enter Dashboard
              <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md font-bold text-lg text-slate-300 flex items-center justify-center hover:scale-105 transform duration-200">
            Read Whitepaper
          </a>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="relative z-10 py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Core Architecture</h2>
          <p className="text-slate-400 text-lg">Built on cutting-edge Web3 and AI infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-lg hover:border-indigo-500/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">Multi-Agent Debate</h3>
            <p className="text-slate-400 leading-relaxed">Sophisticated LLM agents analyze realtime market conditions and debate strategies aggressively before generating a unified, optimized proposal.</p>
          </div>
          
          {/* Card 2 */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-lg hover:border-purple-500/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">TEE Privacy & Security</h3>
            <p className="text-slate-400 leading-relaxed">All strategy generations and voting logic are executed inside Ritual's Trusted Execution Environment, ensuring complete privacy, zero MEV, and verifiable execution.</p>
          </div>
          
          {/* Card 3 */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-lg hover:border-blue-500/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 shadow-inner">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">Automated Execution</h3>
            <p className="text-slate-400 leading-relaxed">The Ritual Scheduler automatically triggers debate, voting, and rebalancing cycles without any manual intervention. A true "Set and Forget" DAO.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-500">
        <p className="font-medium">© 2026 EvoTrade DAO. Built on Ritual Testnet.</p>
      </footer>
    </div>
  );
};

export default Landing;
