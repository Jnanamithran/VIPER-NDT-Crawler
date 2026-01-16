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
    <div className="flex items-center justify-center min-h-screen bg-slate-950 overflow-hidden p-4">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black"></div>
      
      <form onSubmit={handleLogin} className="relative w-full max-w-md px-8 py-12 bg-slate-900 backdrop-blur rounded-lg border border-slate-800 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-xl hover:bg-orange-700 transition-colors">
            V
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-center font-black text-2xl sm:text-3xl mb-2 text-white tracking-tight">
          VIPER <span className="text-orange-600">NDT</span>
        </h1>
        <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Manager Portal</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-orange-600/10 border border-orange-600/30 rounded-lg">
            <p className="text-orange-400 text-sm font-semibold">
              ⚠ {error}
            </p>
          </div>
        )}

        {/* Email Input */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Email</label>
          <input 
            type="email" 
            placeholder="admin@viper.ai" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600/50 transition-all duration-200 font-medium"
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
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600/50 transition-all duration-200 font-medium"
          />
        </div>

        {/* Login Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-200 shadow-lg shadow-orange-600/20"
        >
          {loading ? "ACCESSING..." : "ACCESS PORTAL"}
        </button>

        {/* Test Credentials */}
        <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
          <p className="text-slate-400 text-xs font-bold mb-3 uppercase tracking-widest">Test Credentials</p>
          <p className="text-slate-400 text-xs font-mono mb-1">Email: <span className="text-slate-300">admin@viper.ai</span></p>
          <p className="text-slate-400 text-xs font-mono">Pass: <span className="text-slate-300">password123</span></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;