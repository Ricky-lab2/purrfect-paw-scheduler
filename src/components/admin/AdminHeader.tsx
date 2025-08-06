
import { Bell, Search, Settings, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "user" | "system";
  timestamp: string;
  read: boolean;
}

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch dynamic notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const dynamicNotifications: Notification[] = [];

        // Fetch recent appointments
        const { data: appointments } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (appointments) {
          appointments.forEach((appointment, index) => {
            dynamicNotifications.push({
              id: `appointment-${appointment.id}`,
              title: "New appointment request",
              message: `${appointment.owner_name} requested an appointment for ${appointment.pet_name}`,
              type: "appointment",
              timestamp: appointment.created_at,
              read: false
            });
          });
        }

        // Fetch recent users
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (profiles) {
          profiles.forEach((profile) => {
            dynamicNotifications.push({
              id: `user-${profile.id}`,
              title: "New user registered",
              message: `${profile.name} created an account`,
              type: "user",
              timestamp: profile.created_at,
              read: false
            });
          });
        }

        // Add system notifications
        dynamicNotifications.push({
          id: "system-1",
          title: "System update",
          message: "Dashboard analytics have been updated",
          type: "system",
          timestamp: new Date().toISOString(),
          read: false
        });

        setNotifications(dynamicNotifications.slice(0, 6));
        setUnreadCount(dynamicNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // Fallback to some basic notifications
        setNotifications([
          {
            id: "fallback-1",
            title: "Welcome to Admin Dashboard",
            message: "Your dashboard is ready to use",
            type: "system",
            timestamp: new Date().toISOString(),
            read: false
          }
        ]);
        setUnreadCount(1);
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the admin dashboard.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-60 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pet-blue-dark focus:border-transparent"
            />
          </div>
          
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="bg-pet-blue-dark text-white p-3">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-white/80">{unreadCount} unread</p>
                )}
              </div>
              <div className="p-3 max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div 
                      key={notification.id}
                      className={`border-b border-gray-100 pb-2 mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* User Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
                <div className="h-8 w-8 rounded-full bg-pet-blue-dark flex items-center justify-center text-white">
                  <User size={16} />
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-0">
              <div className="p-3 border-b">
                <p className="font-medium">{user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "admin@purrfectpaw.com"}</p>
              </div>
              <div className="p-2">
                <button 
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2"
                  onClick={() => navigate("/profile")}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2 text-red-500"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
