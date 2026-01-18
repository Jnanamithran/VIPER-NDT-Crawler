import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock, Mail, LogIn, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/portal');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gray-900/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-gray-900/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-black border border-gray-900 rounded-2xl shadow-2xl p-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-100 mb-2">
              VIPER <span className="text-gray-400">NDT</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">
              Owner Portal
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-500 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-400" />
                <p className="text-red-300 font-semibold text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@viper.ai"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border-2 border-gray-800 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-700 focus:bg-black transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border-2 border-gray-800 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-700 focus:bg-black transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 disabled:bg-gray-900 disabled:border-gray-900 text-white font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Access Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <p className="text-gray-300 font-bold text-xs mb-3 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Test Credentials
            </p>
            <div className="space-y-1 text-xs font-mono">
              <p className="text-gray-400">
                <span className="text-gray-500">Email:</span>{' '}
                <span className="text-gray-200 font-bold">admin@viper.ai</span>
              </p>
              <p className="text-gray-400">
                <span className="text-gray-500">Pass:</span>{' '}
                <span className="text-gray-200 font-bold">password123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-xs font-medium">
            © 2025 VIPER NDT. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
