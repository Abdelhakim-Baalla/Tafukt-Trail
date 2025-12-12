import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../../services/api';
import { getUserRole, isAuthenticated } from '../../../utils/auth';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      navigate(role === 'ADMIN' ? '/admin' : '/chauffeur');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await login(email, password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        const role = getUserRole();
        navigate(role === 'ADMIN' ? '/admin' : '/chauffeur');
      } else {
        setError(data.message || 'Identifiants incorrects');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">T</Link>
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-subtitle">Accédez à votre espace de gestion</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Mot de passe</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="auth-footer">
          Pas de compte ? <Link to="/register" className="auth-link">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;