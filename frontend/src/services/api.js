const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, motDePasse) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, motDePasse })
  });
  return response.json();
};