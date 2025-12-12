import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../../services/api';
import { getUserRole, isAuthenticated } from '../../../utils/auth';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: ''
  });
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
      const data = await register({ ...formData, role: 'CHAUFFEUR' });
      if (data.token) {
        localStorage.setItem('token', data.token);
        const role = getUserRole();
        navigate(role === 'ADMIN' ? '/admin' : '/chauffeur');
      } else {
        setError(data.message || 'Erreur d\'inscription');
      }
    } catch {
      setError('Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <img src="/TafuktTrail-icon.png" alt="Tafukt" />
          </Link>
          <h1 className="auth-title">Inscription</h1>
          <p className="auth-subtitle">Créez votre compte chauffeur</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Nom</label>
              <input
                type="text"
                name="nom"
                className="auth-input"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Prénom</label>
              <input
                type="text"
                name="prenom"
                className="auth-input"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="nom@exemple.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              className="auth-input"
              placeholder="+212 6XX XXX XXX"
              value={formData.telephone}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              className="auth-input"
              placeholder="••••••••"
              value={formData.motDePasse}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="auth-footer">
          Déjà un compte ? <Link to="/login" className="auth-link">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;