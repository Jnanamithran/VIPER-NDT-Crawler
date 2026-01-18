import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import OwnerPortal from './pages/OwnerPortal';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Controller Dashboard */}
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        
        {/* Public Analytics */}
        <Route path="/analytics" element={
          <Layout>
            <Analytics />
          </Layout>
        } />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Owner/Manager Portal - Unified */}
        <Route path="/portal" element={
          <ProtectedRoute>
            <OwnerPortal />
          </ProtectedRoute>
        } />

        {/* Legacy routes redirect */}
        <Route path="/owner" element={<Navigate to="/portal" replace />} />
        <Route path="/manager/*" element={<Navigate to="/portal" replace />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
