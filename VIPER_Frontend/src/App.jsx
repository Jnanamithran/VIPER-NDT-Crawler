import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import OwnerPortal from './pages/OwnerPortal';
import ProtectedRoute from './components/ProtectedRoute'; // Secure access logic

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Only identified managers can access the data hub */}
          <Route path="/owner" element={<OwnerPortal />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;