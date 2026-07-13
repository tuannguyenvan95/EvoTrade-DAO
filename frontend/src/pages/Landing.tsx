import { Link } from 'react-router-dom';
import { Bot, Shield, Zap, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-300/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300/30 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">EvoTrade DAO</span>
        </Link>
        <Link to="/dashboard">
          <button className="px-6 py-2.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 transition-all shadow-sm font-medium text-sm flex items-center gap-2 group text-slate-700 dark:text-slate-300">
            Launch App
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-5xl mx-auto mt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Live on Ritual Testnet
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
          The First <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Self-Evolving</span><br />
          AI Trading DAO
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-12">
          Multiple AI Agents debate and vote on trading strategies inside a Trusted Execution Environment (TEE). Fully autonomous, completely verifiable, and powered by Ritual.
        </p>

        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <button className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 text-lg">
              Enter Dashboard
              <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
          <a href="#features" className="px-8 py-4 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-all shadow-sm font-semibold text-lg text-slate-600 dark:text-slate-400">
            Learn More
          </a>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-900 dark:text-white">
        <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Multi-Agent Debate</h3>
          <p className="text-slate-500 dark:text-slate-400">LLM agents analyze market conditions and debate strategies before generating a unified proposal.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">TEE Privacy & Security</h3>
          <p className="text-slate-500 dark:text-slate-400">All strategy generations and voting logic are executed inside Ritual's TEE, ensuring complete privacy and verifiable execution.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Automated Execution</h3>
          <p className="text-slate-500 dark:text-slate-400">Ritual Scheduler automatically triggers debate, voting, and rebalancing cycles without manual intervention.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
