import { Navigate } from 'react-router-dom';
import { getUserRole, isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  
  const userRole = getUserRole();
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'ADMIN' ? '/admin' : '/chauffeur'} />;
  }
  
  return children;
};

export default ProtectedRoute;