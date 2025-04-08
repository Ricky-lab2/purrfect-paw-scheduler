
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Bell, Settings, UserCircle, LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationPreview } from "./NotificationPreview";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Appointment", href: "/appointment" },
    { name: "FAQ", href: "/faq" },
  ];

  // Don't show the navbar on admin pages
  if (isAdminRoute) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-full bg-pet-blue-dark flex items-center justify-center">
            <span className="font-bold text-white text-lg">PP</span>
          </span>
          <span className="font-display font-semibold text-xl dark:text-white">Purrfect Paw</span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors dark:text-white",
                location.pathname === link.href
                  ? "bg-pet-blue text-pet-blue-dark dark:bg-pet-blue/30 dark:text-white"
                  : "hover:bg-pet-gray dark:hover:bg-gray-800"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/appointment"
            className="ml-2 px-5 py-2 bg-pet-blue-dark text-white rounded-full text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </nav>

        {/* User Controls - Right side */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-pet-gray dark:hover:bg-gray-800 transition-colors relative dark:text-white">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0 dark:bg-gray-900 dark:border-gray-800">
                  <div className="bg-pet-blue-dark text-white p-3">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="p-3 max-h-[300px] overflow-y-auto">
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
                      <p className="text-sm font-medium dark:text-white">Appointment Reminder</p>
                      <p className="text-xs text-muted-foreground">Your pet checkup is tomorrow at 10:00 AM</p>
                    </div>
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
                      <p className="text-sm font-medium dark:text-white">New Service Available</p>
                      <p className="text-xs text-muted-foreground">Try our new grooming package with 10% off</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">Vaccination Due</p>
                      <p className="text-xs text-muted-foreground">Max's rabies vaccination is due in 7 days</p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Settings */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-pet-gray dark:hover:bg-gray-800 transition-colors dark:text-white">
                    <Settings size={20} />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 dark:bg-gray-900 dark:border-gray-800">
                  <div className="space-y-1">
                    <Link to="/settings" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md dark:text-white">
                      Settings
                    </Link>
                    <Link to="/help" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md dark:text-white">
                      Help & Support
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                    <Link to="/feedback" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md dark:text-white">
                      Send Feedback
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Profile */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-pet-gray dark:hover:bg-gray-800 transition-colors dark:text-white">
                    <UserCircle size={20} />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 dark:bg-gray-900 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3 p-2">
                    <div className="w-10 h-10 rounded-full bg-pet-blue-dark flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.name.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm dark:text-white">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md dark:text-white">
                      Your Profile
                    </Link>
                    <Link to="/pets" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md dark:text-white">
                      My Pets
                    </Link>
                    <Link to="/appointments" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md dark:text-white">
                      My Appointments
                    </Link>
                    
                    {/* Show Admin Link only for admin users */}
                    {isAdmin && (
                      <Link to="/admin" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md font-medium text-pet-blue-dark dark:text-pet-blue">
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md text-red-500"
                    >
                      <span>Sign Out</span>
                      <LogOut size={16} />
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-pet-blue-dark text-white rounded-full text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md py-4 animate-fade-in">
          <nav className="container mx-auto px-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors dark:text-white",
                  location.pathname === link.href
                    ? "bg-pet-blue text-pet-blue-dark dark:bg-pet-blue/30 dark:text-white"
                    : "hover:bg-pet-gray dark:hover:bg-gray-800"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/appointment"
              className="mt-4 px-5 py-3 bg-pet-blue-dark text-white rounded-lg text-sm font-medium transition-all text-center"
            >
              Book Appointment
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pet-gray dark:hover:bg-gray-800 dark:text-white">
                    <Bell size={18} />
                    <span className="text-sm">Notifications</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pet-gray dark:hover:bg-gray-800 dark:text-white">
                    <Settings size={18} />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pet-gray dark:hover:bg-gray-800 dark:text-white">
                    <UserCircle size={18} />
                    <span className="text-sm">Profile</span>
                  </button>
                </div>
                
                {/* Add Admin Link to mobile menu for admin users */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-pet-gray dark:bg-gray-800 text-pet-blue-dark dark:text-pet-blue font-medium mt-2"
                  >
                    <UserCircle size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-medium mt-2"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="mt-4 px-5 py-3 bg-pet-blue text-pet-blue-dark dark:bg-pet-blue/30 dark:text-white rounded-lg text-sm font-medium transition-all text-center"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
