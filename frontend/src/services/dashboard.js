const API_URL = import.meta.env.VITE_API_URL;

export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Non authentifié");
  }

  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Session expirée");
    }
    throw new Error("Erreur serveur");
  }

  return response.json();
};
