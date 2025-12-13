const API_URL = import.meta.env.VITE_API_URL;

export const getDashboardStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};