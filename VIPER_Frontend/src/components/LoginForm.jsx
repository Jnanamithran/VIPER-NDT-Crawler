import React, { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../firebase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden p-4">
      <form onSubmit={handleLogin} className="relative w-full max-w-md px-8 py-12 bg-white backdrop-blur rounded-lg border border-gray-200 shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-xl hover:bg-blue-700 transition-colors">
            V
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-center font-black text-2xl sm:text-3xl mb-2 text-gray-800 tracking-tight">
          VIPER <span className="text-blue-600">NDT</span>
        </h1>
        <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Manager Portal</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-semibold">
              ⚠ {error}
            </p>
          </div>
        )}

        {/* Email Input */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Email</label>
          <input 
            type="email" 
            placeholder="admin@viper.ai" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-all duration-200 font-medium"
          />
        </div>

        {/* Password Input */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-all duration-200 font-medium"
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2">Remember me</span>
          </label>
        </div>

        {/* Login Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold uppercase tracking-widest rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20"
        >
          {loading ? "ACCESSING..." : "ACCESS PORTAL"}
        </button>

        {/* Test Credentials */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-xs font-bold mb-3 uppercase tracking-widest">Test Credentials</p>
          <p className="text-gray-500 text-xs font-mono mb-1">Email: <span className="text-gray-700">admin@viper.ai</span></p>
          <p className="text-gray-500 text-xs font-mono">Pass: <span className="text-gray-700">password123</span></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;