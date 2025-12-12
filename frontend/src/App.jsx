import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Login from './pages/shared/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
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
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/camions" element={<CamionsList />} />
          <Route path="/admin/remorques" element={<RemorquesList />} />
          <Route path="/admin/pneus" element={<PneusList />} />
          <Route path="/admin/maintenance" element={<MaintenanceList />} />
          <Route path="/admin/rapports" element={<RapportsList />} />
          <Route path="/chauffeur" element={<ChauffeurDashboard />} />
          <Route path="/chauffeur/trajets" element={<TrajetsList />} />
          <Route path="/chauffeur/carburant" element={<CarburantList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
