import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { decodeToken } from '../utils/auth';

// Création du contexte d'authentification
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialiser l'utilisateur depuis le token stocké
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded) {
        // Vérifier si le token n'est pas expiré
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setUser({
            id: decoded.id,
            nom: decoded.nom,
            prenom: decoded.prenom,
            email: decoded.email,
            role: decoded.role
          });
          setToken(storedToken);
        } else {
          // Token expiré, nettoyer
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
    }
    setLoading(false);
  }, []);

  // Fonction de connexion
  const login = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    const decoded = decodeToken(newToken);
    setUser({
      id: decoded?.id || userData?.id,
      nom: decoded?.nom || userData?.nom,
      prenom: decoded?.prenom || userData?.prenom,
      email: decoded?.email || userData?.email,
      role: decoded?.role || userData?.role
    });
  }, []);

  // Fonction de déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  // Vérifier le rôle de l'utilisateur
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Valeur du contexte
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    isAdmin: user?.role === 'ADMIN',
    isChauffeur: user?.role === 'CHAUFFEUR'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
