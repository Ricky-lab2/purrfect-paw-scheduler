
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    // User is logged in but not an admin, redirect to home
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and meets role requirements
  return <>{children}</>;
};
