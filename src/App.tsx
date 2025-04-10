
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Appointment from "./pages/Appointment";
import Login from "./pages/Login";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Admin from "./pages/admin/Dashboard";
import { FloatingChatbot } from "./components/FloatingChatbot";
import { AppointmentProvider } from "./contexts/AppointmentContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <AppointmentProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/appointment"
                element={
                  <ProtectedRoute>
                    <Appointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <FloatingChatbot />
          </AppointmentProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
