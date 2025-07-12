import { jwtDecode } from 'jwt-decode';

export const getUserRole = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // fixed import
    return decoded.role || null;
  } catch (error) {
    return null;
  }
};
  