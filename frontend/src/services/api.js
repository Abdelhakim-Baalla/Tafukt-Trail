const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, motDePasse) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, motDePasse }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erreur de connexion");
  }
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erreur d'inscription");
  }
  return data;
};
