import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth'; // Install with: npm install react-firebase-hooks
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-400 font-bold uppercase tracking-widest">IDENTIFYING CREDENTIALS...</div>;
  if (!user) return <Navigate to="/login" replace />; // Redirects unauthorized users

  return children;
};

export default ProtectedRoute;