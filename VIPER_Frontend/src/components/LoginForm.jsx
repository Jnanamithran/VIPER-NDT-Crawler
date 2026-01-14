import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden p-4">
      {/* Animated background effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
      
      <form onSubmit={handleLogin} className="relative w-full max-w-md px-6 py-12 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl">
        {/* Logo/Header */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center font-black text-white text-xl italic transform hover:scale-110 transition-transform">
            V
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-center font-black italic text-2xl sm:text-3xl mb-2 text-white tracking-tight">
          VIPER <span className="text-orange-600">NDT</span>
        </h1>
        <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Manager Portal Access</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
              <span className="text-lg">⚠</span> {error}
            </p>
          </div>
        )}

        {/* Email Input */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Email Address</label>
          <input 
            type="email" 
            placeholder="admin@viper.ai" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-orange-500/10 transition-all duration-200 font-medium"
          />
        </div>

        {/* Password Input */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-orange-500/10 transition-all duration-200 font-medium"
          />
        </div>

        {/* Login Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-orange-600/50 disabled:to-orange-700/50 text-white font-black uppercase tracking-widest rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 shadow-lg shadow-orange-600/20"
        >
          {loading ? "ACCESSING..." : "ACCESS PORTAL"}
        </button>

        {/* Test Credentials Info */}
        <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
          <p className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-widest">Test Credentials:</p>
          <p className="text-orange-500 text-xs font-mono mb-1">Email: <span className="text-slate-300">admin@viper.ai</span></p>
          <p className="text-orange-500 text-xs font-mono">Pass: <span className="text-slate-300">password123</span></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;