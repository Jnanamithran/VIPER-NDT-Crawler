import { useLocation, Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center glass-card p-12">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-display text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-2">Page not found</p>
        <p className="text-sm text-muted-foreground mb-8 font-mono">
          Route: {location.pathname}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 btn-viper"
        >
          <Home className="w-4 h-4" />
          Return to HUD
        </Link>
      </div>
    </div>
  );
};

export default NotFound;