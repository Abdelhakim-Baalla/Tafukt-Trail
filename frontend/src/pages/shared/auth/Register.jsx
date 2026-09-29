import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './Auth.css';

const getStrength = (value) => {
  if (!value) return { score: 0, label: 'En attente' };
  let score = 0;
  if (value.length >= 6) score += 1;
  if (value.length >= 10) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/[0-9]/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
  const capped = Math.min(score, 4);
  const labels = ['Trop court', 'Faible', 'Correct', 'Bon', 'Solide'];
  return { score: capped, label: value.length < 6 ? 'Trop court' : labels[capped] };
};

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
  const { login, isAuthenticated, user } = useAuth();

  const strength = useMemo(() => getStrength(formData.motDePasse), [formData.motDePasse]);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(user?.role === 'ADMIN' ? '/admin' : '/chauffeur');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Contrôles client alignés sur la validation backend (Joi)
    if (formData.nom.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères.');
      return;
    }
    if (formData.prenom.trim().length < 2) {
      setError('Le prénom doit contenir au moins 2 caractères.');
      return;
    }
    if (!formData.telephone.trim()) {
      setError('Le numéro de téléphone est requis.');
      return;
    }
    if (!/^[0-9+]{10,15}$/.test(formData.telephone.trim())) {
      setError('Numéro de téléphone invalide (10 à 15 chiffres, ex : +212612345678).');
      return;
    }
    if (formData.motDePasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      const data = await registerApi({ ...formData, role: 'CHAUFFEUR' });
      if (data.token) {
        login(data.token, data.user);
        // La redirection est gérée par useEffect
      } else {
        setError(data.message || 'Erreur d\'inscription');
      }
    } catch (err) {
      setError(err.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <aside className="auth-brand">
          <Link to="/" className="auth-brand-logo">
            <img src="/TafuktTrail-icon.png" alt="Tafukt" />
            <span className="auth-brand-name">Tafukt Trail</span>
          </Link>
          <h2 className="auth-brand-title">Rejoignez les équipes de la route.</h2>
          <p className="auth-brand-text">
            Créez votre compte chauffeur et suivez vos trajets, vos pleins et vos missions en temps réel.
          </p>
          <ul className="auth-brand-points">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Inscription en une minute
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Accès chauffeur sécurisé
            </li>
          </ul>
        </aside>

        <div className="auth-panel">
          <div className="auth-header">
            <Link to="/" className="auth-mobile-logo">
              <img src="/TafuktTrail-icon.png" alt="Tafukt" />
            </Link>
            <h1 className="auth-title">Inscription</h1>
            <p className="auth-subtitle">Créez votre compte chauffeur</p>
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
              <label className="auth-label">Téléphone *</label>
              <input
                type="tel"
                name="telephone"
                className="auth-input"
                placeholder="+212 6XX XXX XXX (ex : +212612345678)"
                value={formData.telephone}
                onChange={handleChange}
                required
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
              <div className="auth-strength" aria-live="polite">
                <div className="auth-strength-bar">
                  {[1, 2, 3, 4].map((seg) => (
                    <span
                      key={seg}
                      className={`auth-strength-seg ${strength.score >= seg ? `on-${strength.score}` : ''}`}
                    />
                  ))}
                </div>
                <span className="auth-strength-label">
                  {formData.motDePasse ? `Mot de passe : ${strength.label}` : '6 caractères minimum'}
                </span>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading && <span className="auth-spinner" aria-hidden="true" />}
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          <p className="auth-footer">
            Déjà un compte ? <Link to="/login" className="auth-link">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
