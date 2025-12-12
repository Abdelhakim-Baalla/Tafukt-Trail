import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../../services/api';
import { getUserRole, isAuthenticated } from '../../../utils/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      navigate(role === 'ADMIN' ? '/admin' : '/chauffeur');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register({ ...formData, role: 'CHAUFFEUR' });
      if (data.token) {
        localStorage.setItem('token', data.token);
        const role = getUserRole();
        navigate(role === 'ADMIN' ? '/admin' : '/chauffeur');
      }
    } catch (error) {
      alert('Erreur d\'inscription');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: '100%', margin: '50px auto', padding: '20px' }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          required
        />
        <input
          name="prenom"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          required
        />
        <input
          name="motDePasse"
          type="password"
          placeholder="Mot de passe"
          value={formData.motDePasse}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          required
        />
        <input
          name="telephone"
          placeholder="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        />

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
          S'inscrire
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link to="/login">Déjà un compte ? Se connecter</Link>
      </p>
    </div>
  );
};

export default Register;