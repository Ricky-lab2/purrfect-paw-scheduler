
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const Appointment = lazy(() => import("./pages/Appointment"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));

// Admin Pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminAppointments = lazy(() => import("./pages/admin/Appointments"));
const AdminPets = lazy(() => import("./pages/admin/Pets"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-screen">
                    <div className="animate-pulse">Loading...</div>
                  </div>
                }>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/appointment" element={<Appointment />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<AdminDashboard />} />
                      <Route path="appointments" element={<AdminAppointments />} />
                      <Route path="pets" element={<AdminPets />} />
                      <Route path="users" element={<AdminUsers />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <FloatingChatbot />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
