import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * PublicRoute - Redirects authenticated users away from public routes like /login and /register
 * If user is already authenticated, redirect them to their appropriate dashboard
 */
function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, redirect them away from public routes
  if (user) {
    // Redirect admin to admin dashboard, regular users to user services
    const redirectPath = user.role === "admin" ? "/admin/dashboard" : "/user/services";
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated, allow access to public route
  return children;
}

export default PublicRoute;

