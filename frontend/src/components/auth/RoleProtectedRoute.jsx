import { Navigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const role = getUserRole();

  if (!role) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
};

export default RoleProtectedRoute;