import { Link, useNavigate } from 'react-router-dom';
import { getUserRole, isAuthenticated } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          Tafukt Trail
        </Link>
        <div>
          {userRole === 'ADMIN' && (
            <>
              <Link to="/admin" style={{ margin: '0 5px', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/admin/camions" style={{ margin: '0 5px', textDecoration: 'none' }}>Camions</Link>
              <Link to="/admin/remorques" style={{ margin: '0 5px', textDecoration: 'none' }}>Remorques</Link>
              <Link to="/admin/pneus" style={{ margin: '0 5px', textDecoration: 'none' }}>Pneus</Link>
              <Link to="/admin/maintenance" style={{ margin: '0 5px', textDecoration: 'none' }}>Maintenance</Link>
              <Link to="/admin/rapports" style={{ margin: '0 5px', textDecoration: 'none' }}>Rapports</Link>
            </>
          )}
          {userRole === 'CHAUFFEUR' && (
            <>
              <Link to="/chauffeur" style={{ margin: '0 5px', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/chauffeur/trajets" style={{ margin: '0 5px', textDecoration: 'none' }}>Trajets</Link>
              <Link to="/chauffeur/carburant" style={{ margin: '0 5px', textDecoration: 'none' }}>Carburant</Link>
            </>
          )}
          {isAuthenticated() ? (
            <button onClick={handleLogout} style={{ margin: '0 10px', padding: '5px 10px' }}>Déconnexion</button>
          ) : (
            <Link to="/login" style={{ margin: '0 10px', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;