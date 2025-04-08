
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  redirectTo = "/login"
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // User is not logged in, redirect to login while preserving the intended destination
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    // User is logged in but not an admin, redirect to home
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and meets role requirements
  return <>{children}</>;
};
