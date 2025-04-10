
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  PawPrint, 
  Settings,
  LogOut
} from "lucide-react";

export function AdminSidebar() {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Pets", href: "/admin/pets", icon: PawPrint },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-pet-blue-dark text-white flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
            <span className="font-bold text-pet-blue-dark text-lg">PP</span>
          </span>
          <span className="font-display font-semibold text-xl">Admin Panel</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5 text-white/80"
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2 rounded-md w-full hover:bg-white/5 text-white/80 transition-colors">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
