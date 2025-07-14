import Layout from "./components/layout/Layout.jsx";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import FreelancerDashboard from "./pages/dashboard/FreelancerDashboard.jsx";
import { AuthProvider } from './AuthContext.jsx'; // Import the AuthProvider

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/client"
            element={
              <RoleProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard />
              </RoleProtectedRoute>
            }
          />  
          <Route
            path="/freelancer"
            element={
              <RoleProtectedRoute allowedRoles={["freelancer"]}>
                <FreelancerDashboard />
              </RoleProtectedRoute>
            }
          /> 
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App