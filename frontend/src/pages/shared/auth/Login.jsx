import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../../services/api';
import { getUserRole, isAuthenticated } from '../../../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
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
      const data = await login(email, motDePasse);
      if (data.token) {
        localStorage.setItem('token', data.token);
        const role = getUserRole();
        navigate(role === 'ADMIN' ? '/admin' : '/chauffeur');
      }
    } catch (error) {
      alert('Erreur de connexion');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '70px auto', padding: '20px' }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Se connecter
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link to="/register">Pas de compte ? S'inscrire</Link>
      </p>
    </div>
  );
};

export default Login;