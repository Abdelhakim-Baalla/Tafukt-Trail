import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/shared/auth/Login';
import Register from './pages/shared/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTrajetsList from './pages/admin/trajets/TrajetsList';
import CamionsList from './pages/admin/camions/CamionsList';
import RemorquesList from './pages/admin/remorques/RemorquesList';
import PneusList from './pages/admin/pneus/PneusList';
import MaintenanceList from './pages/admin/maintenance/MaintenanceList';
import RapportsList from './pages/admin/rapports/RapportsList';
import ChauffeurDashboard from './pages/chauffeur/ChauffeurDashboard';
import TrajetsList from './pages/chauffeur/trajets/TrajetsList';
import CarburantList from './pages/chauffeur/carburant/CarburantList';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/trajets" element={<ProtectedRoute requiredRole="ADMIN"><AdminTrajetsList /></ProtectedRoute>} />
          <Route path="/admin/camions" element={<ProtectedRoute requiredRole="ADMIN"><CamionsList /></ProtectedRoute>} />
          <Route path="/admin/remorques" element={<ProtectedRoute requiredRole="ADMIN"><RemorquesList /></ProtectedRoute>} />
          <Route path="/admin/pneus" element={<ProtectedRoute requiredRole="ADMIN"><PneusList /></ProtectedRoute>} />
          <Route path="/admin/maintenance" element={<ProtectedRoute requiredRole="ADMIN"><MaintenanceList /></ProtectedRoute>} />
          <Route path="/admin/rapports" element={<ProtectedRoute requiredRole="ADMIN"><RapportsList /></ProtectedRoute>} />
          <Route path="/chauffeur" element={<ProtectedRoute requiredRole="CHAUFFEUR"><ChauffeurDashboard /></ProtectedRoute>} />
          <Route path="/chauffeur/trajets" element={<ProtectedRoute requiredRole="CHAUFFEUR"><TrajetsList /></ProtectedRoute>} />
          <Route path="/chauffeur/carburant" element={<ProtectedRoute requiredRole="CHAUFFEUR"><CarburantList /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
