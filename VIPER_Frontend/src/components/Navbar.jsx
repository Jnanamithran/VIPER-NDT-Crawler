import { Link, useLocation } from 'react-router-dom';
import { Activity, BarChart3, Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'HUD', icon: Activity },
    { path: '/analytics', label: 'ANALYTICS', icon: BarChart3 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">V</span>
            </div>
            <span className="font-display font-bold text-lg tracking-wider">
              <span className="text-foreground">VIPER</span>
              <span className="text-primary ml-1">NDT</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-display text-sm tracking-wider
                  transition-all duration-200
                  ${isActive(item.path) 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            
            <Link
              to="/manager"
              className={`
                flex items-center gap-2 px-5 py-2 rounded-lg font-display text-sm tracking-wider
                transition-all duration-200 ml-2
                ${isActive('/manager')
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-primary text-primary-foreground hover:brightness-110'
                }
              `}
              style={{ boxShadow: '0 0 15px hsl(24 100% 50% / 0.3)' }}
            >
              <Shield className="w-4 h-4" />
              MANAGER
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;