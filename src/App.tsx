
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, memo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { NotificationPreview } from "@/components/NotificationPreview";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { initializeData } from "@/utils/seedData";
import { NotificationProvider, useNotification } from "@/contexts/NotificationContext";

// Initialize the data
initializeData();

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const Appointment = lazy(() => import("./pages/Appointment"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const UserPets = lazy(() => import("./pages/UserPets"));
const UserAppointments = lazy(() => import("./pages/UserAppointments"));

// Admin Pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminAppointments = lazy(() => import("./pages/admin/Appointments"));
const AdminPets = lazy(() => import("./pages/admin/Pets"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const BookingRecords = lazy(() => import("./pages/admin/BookingRecords"));
const SignupsPage = lazy(() => import("./pages/admin/Signups"));

// Improved loading component
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pet-blue-dark"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
));

// Redirect component based on auth status
const AuthRedirect = memo(() => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // If user is authenticated and on login/signup page, redirect appropriately
      if (['/login', '/signup'].includes(location.pathname)) {
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    }
  }, [isAuthenticated, isAdmin, navigate, location.pathname, isLoading]);

  return null;
});

// Optimized query client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Notification wrapper component
const NotificationWrapper = memo(() => {
  const { currentNotification, isVisible, hideNotification } = useNotification();
  
  return (
    <NotificationPreview
      show={isVisible}
      appointment={currentNotification}
      onClose={hideNotification}
    />
  );
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthRedirect />
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      
                      {/* Protected Customer Routes */}
                      <Route path="/appointment" element={
                        <ProtectedRoute>
                          <Appointment />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      <Route path="/my-pets" element={
                        <ProtectedRoute>
                          <UserPets />
                        </ProtectedRoute>
                      } />
                      <Route path="/my-appointments" element={
                        <ProtectedRoute>
                          <UserAppointments />
                        </ProtectedRoute>
                      } />
                      
                      {/* Protected Admin Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="appointments" element={<AdminAppointments />} />
                        <Route path="booking-records" element={<BookingRecords />} />
                        <Route path="pets" element={<AdminPets />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="signups" element={<SignupsPage />} />
                      </Route>
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <FloatingChatbot />
                <NotificationWrapper />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
