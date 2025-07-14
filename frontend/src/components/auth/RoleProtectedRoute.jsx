import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx"; 

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { isLoggedIn, userRole, loading } = useAuth();

  if (loading) return null; 

  if (!isLoggedIn) return <Navigate to="/login" />;

  if (!allowedRoles.includes(userRole)) return <Navigate to="/" />;

  return children;
};

export default RoleProtectedRoute;
