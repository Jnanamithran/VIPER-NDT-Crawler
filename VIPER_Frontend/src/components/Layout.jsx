import { Link } from 'react-router-dom';

export const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-600/30">
    <nav className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-sm">V</div>
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-white hidden sm:block">VIPER <span className="text-orange-600">NDT</span></h1>
        </div>
        <div className="flex gap-4 sm:gap-8 text-xs sm:text-sm font-bold uppercase tracking-widest items-center flex-wrap justify-end">
          <a href="/" className="text-slate-300 hover:text-orange-400 transition-colors duration-200">HUD</a>
          <a href="/analytics" className="text-slate-300 hover:text-orange-400 transition-colors duration-200 hidden sm:block">Analytics</a>
          <a href="/owner" className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-5 py-2 rounded-lg font-bold transition-all duration-200 whitespace-nowrap">Manager</a>
        </div>
      </div>
    </nav>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
  </div>
);