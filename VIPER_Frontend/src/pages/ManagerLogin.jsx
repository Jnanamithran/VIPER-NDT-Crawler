import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { AlertTriangle, Lock, Mail, LogIn, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User state will update and Manager component will show portal
    } catch (err) {
      const errorMessage = err.code === 'auth/invalid-credential' 
        ? 'Invalid email or password.' 
        : 'Authentication failed. Please try again.';
      setError(errorMessage);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Simple Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">V</span>
            </div>
            <span className="font-display font-bold text-lg tracking-wider">
              <span className="text-foreground">VIPER</span>
              <span className="text-primary ml-1">NDT</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </div>
      
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
                    required
                    className="
                      w-full pl-10 pr-4 py-3 rounded-lg
                      bg-muted/50 border border-border
                      text-foreground placeholder:text-muted-foreground
                      focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                      transition-all duration-200
                    "
                    placeholder="your-email@example.com"
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
                    required
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
                  relative overflow-hidden flex items-center justify-center gap-2
                "
                style={{ boxShadow: '0 0 20px hsl(24 100% 50% / 0.3)' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Access Portal</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerLogin;
