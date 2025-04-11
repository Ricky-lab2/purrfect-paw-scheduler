
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  showToast?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  showToast = true 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  if (!isAuthenticated) {
    // Show toast notification if enabled
    if (showToast) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
    
    // User is not logged in, redirect to login with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    // User is logged in but not an admin, redirect to home
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and meets role requirements
  return <>{children}</>;
};
