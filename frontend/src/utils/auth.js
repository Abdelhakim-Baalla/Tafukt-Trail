export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem('token');
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};