import { Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EvoTrade DAO</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Self-evolving AI Trading DAO. On-chain AI debate and execution inside a TEE — completely verifiable.
            </p>
            <div className="text-xs text-slate-500 font-medium">
              Built on Ritual Chain • ID 1979
            </div>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">Product</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Active Proposals</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Treasury Metrics</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
            </ul>
          </div>

          {/* Ritual Col */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">Ritual</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="https://ritual.net" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Website</a></li>
              <li><a href="https://docs.ritual.net" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a></li>
              <li><a href="https://github.com/ritual-net" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="https://twitter.com/ritualnet" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">X (Twitter)</a></li>
            </ul>
          </div>

          {/* Community Col */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">Community</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="https://discord.gg/ritual-net" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Email</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© 2026 EvoTrade DAO. Testnet demo — not financial advice.</div>
          <div className="flex items-center gap-2">
            Powered by Ritual TEE precompiles
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
