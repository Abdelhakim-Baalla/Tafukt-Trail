import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// Layout pour les routes Admin (Nested Routes)
const AdminLayout = () => (
  <ProtectedRoute requiredRole="ADMIN">
    <Outlet />
  </ProtectedRoute>
);

// Layout pour les routes Chauffeur (Nested Routes)
const ChauffeurLayout = () => (
  <ProtectedRoute requiredRole="CHAUFFEUR">
    <Outlet />
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes Admin - Nested Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="trajets" element={<AdminTrajetsList />} />
              <Route path="camions" element={<CamionsList />} />
              <Route path="remorques" element={<RemorquesList />} />
              <Route path="pneus" element={<PneusList />} />
              <Route path="maintenance" element={<MaintenanceList />} />
              <Route path="rapports" element={<RapportsList />} />
            </Route>
            
            {/* Routes Chauffeur - Nested Routes */}
            <Route path="/chauffeur" element={<ChauffeurLayout />}>
              <Route index element={<ChauffeurDashboard />} />
              <Route path="trajets" element={<TrajetsList />} />
              <Route path="carburant" element={<CarburantList />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
