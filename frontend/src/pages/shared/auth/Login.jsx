import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../../services/api';
import { getUserRole, isAuthenticated } from '../../../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      navigate(role === 'ADMIN' ? '/admin' : '/chauffeur');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const data = await login(email, motDePasse);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setMessage('Connexion réussie!');
        setTimeout(() => {
          const role = getUserRole();
          navigate(role === 'ADMIN' ? '/admin' : '/chauffeur');
        }, 1000);
      } else {
        setMessage(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      setMessage('Erreur de connexion');
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
      {message && (
        <p style={{ textAlign: 'center', marginTop: '10px', color: message.includes('réussie') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link to="/register">Pas de compte ? S'inscrire</Link>
      </p>
    </div>
  );
};

export default Login;