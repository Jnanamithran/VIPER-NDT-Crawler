import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export const Layout = ({ children }) => {
  const [user] = useAuthState(auth);

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans">
      <nav className="bg-black border-b border-gray-900 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg">V</div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-gray-100 hidden sm:block">VIPER <span className="text-gray-400">NDT</span></h1>
          </div>
          <div className="flex gap-4 sm:gap-8 text-xs sm:text-sm font-bold uppercase tracking-widest items-center flex-wrap justify-end">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">HUD</Link>
            <Link to="/analytics" className="text-gray-400 hover:text-white transition-colors duration-200 hidden sm:block">Analytics</Link>
            {user ? (
              <Link to="/portal" className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 hover:border-gray-700 text-white px-4 sm:px-5 py-2 rounded-lg font-bold transition-all duration-200 whitespace-nowrap shadow-lg">Portal</Link>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 hover:border-gray-700 text-white px-4 sm:px-5 py-2 rounded-lg font-bold transition-all duration-200 whitespace-nowrap shadow-lg">Login</Link>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
    </div>
  );
};