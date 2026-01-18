import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, HelpCircle, Lock, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';

const Manager = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@viper.ai');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@viper.ai' && password === 'password123') {
      navigate('/');
    } else {
      setError('Invalid email or password');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Background effects */}
      <div className="absolute inset-0 grid-background opacity-20" />
      
      {/* Scanning lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          style={{
            animation: 'scanLine 4s linear infinite',
          }}
        />
        <div 
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          style={{
            animation: 'scanLine 4s linear infinite',
            animationDelay: '2s',
          }}
        />
      </div>
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      
      <main className="relative pt-32 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="glass-card-glow p-8 relative">
            {/* Scanning effect inside card */}
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
              <div 
                className="absolute left-0 right-0 h-12 bg-gradient-to-b from-primary/10 to-transparent"
                style={{
                  animation: 'scanLine 3s ease-in-out infinite',
                }}
              />
            </div>
            
            {/* Logo */}
            <div className="flex flex-col items-center mb-8 relative">
              <div 
                className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-4"
                style={{ boxShadow: '0 0 30px hsl(24 100% 50% / 0.4)' }}
              >
                <span className="text-primary-foreground font-display font-bold text-2xl">V</span>
              </div>
              <h1 className="font-display text-xl tracking-wider">
                <span className="text-foreground">VIPER</span>
                <span className="text-primary ml-2">NDT</span>
              </h1>
              <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">
                Manager Portal
              </p>
            </div>
            
            {/* Error Message */}
            <div 
              className={`
                mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/30
                flex items-center gap-3 transition-all duration-300
                ${showError ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
              `}
            >
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      w-full pl-10 pr-4 py-3 rounded-lg
                      bg-muted/50 border border-border
                      text-foreground placeholder:text-muted-foreground
                      focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                      transition-all duration-200
                    "
                    placeholder="admin@viper.ai"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full pl-10 pr-4 py-3 rounded-lg
                      bg-muted/50 border border-border
                      text-foreground placeholder:text-muted-foreground
                      focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                      transition-all duration-200
                    "
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full py-3 rounded-lg
                  bg-primary text-primary-foreground
                  font-display font-bold uppercase tracking-wider
                  transition-all duration-200
                  hover:brightness-110 disabled:opacity-50
                  relative overflow-hidden
                "
                style={{ boxShadow: '0 0 20px hsl(24 100% 50% / 0.3)' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  'Access Portal'
                )}
              </button>
            </form>
            
            {/* Test Credentials */}
            <div className="mt-6 p-3 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Test Credentials
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Email: <span className="text-foreground">admin@viper.ai</span>
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Pass: <span className="text-foreground">password123</span>
              </p>
            </div>
            
            {/* Footer Links */}
            <div className="mt-6 flex items-center justify-between">
              <button className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                Technical Support
              </button>
              <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Manager;