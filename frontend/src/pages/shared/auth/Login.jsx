import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(user?.role === 'ADMIN' ? '/admin' : '/chauffeur');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginApi(email, password);
      if (data.token) {
        login(data.token, data.user);
        // La redirection est gérée par useEffect
      } else {
        setError(data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <aside className="auth-brand">
          <Link to="/" className="auth-brand-logo">
            <img src="/TafuktTrail-icon.png" alt="Tafukt" />
            <span className="auth-brand-name">Tafukt Trail</span>
          </Link>
          <h2 className="auth-brand-title">La flotte, pilotée — jour et nuit.</h2>
          <p className="auth-brand-text">
            Connectez-vous pour retrouver vos trajets, vos véhicules et vos alertes au même endroit.
          </p>
          <ul className="auth-brand-points">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Trajets et ordres de mission
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Carburant et maintenance suivis
            </li>
          </ul>
        </aside>

        <div className="auth-panel">
          <div className="auth-header">
            <Link to="/" className="auth-mobile-logo">
              <img src="/TafuktTrail-icon.png" alt="Tafukt" />
            </Link>
            <h1 className="auth-title">Connexion</h1>
            <p className="auth-subtitle">Accédez à votre espace de gestion</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error" role="alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

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
              {loading && <span className="auth-spinner" aria-hidden="true" />}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-footer">
            Pas de compte ? <Link to="/register" className="auth-link">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
