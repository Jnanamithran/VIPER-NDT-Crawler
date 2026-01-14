import { Link } from 'react-router-dom';

export const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30">
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-black text-black italic text-sm">V</div>
          <h1 className="text-lg sm:text-xl font-black tracking-tighter text-white italic hidden sm:block">VIPER <span className="text-orange-600">NDT</span></h1>
        </div>
        <div className="flex gap-4 sm:gap-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest items-center flex-wrap justify-end">
          <a href="/" className="hover:text-orange-500 transition-colors">Pilot HUD</a>
          <a href="/analytics" className="hover:text-orange-500 transition-colors hidden sm:block">Analytics</a>
          <a href="/owner" className="bg-orange-600 text-black px-3 sm:px-4 py-2 rounded font-black hover:bg-white transition-all whitespace-nowrap">Manager</a>
        </div>
      </div>
    </nav>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">{children}</main>
  </div>
);