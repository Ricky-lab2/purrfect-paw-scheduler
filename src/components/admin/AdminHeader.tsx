
import { Bell, Search, Settings, User } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  
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
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="bg-pet-blue-dark text-white p-3">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="p-3 max-h-[300px] overflow-y-auto">
                <div className="border-b border-gray-100 pb-2 mb-2">
                  <p className="text-sm font-medium">New appointment request</p>
                  <p className="text-xs text-muted-foreground">John Doe requested an appointment</p>
                </div>
                <div className="border-b border-gray-100 pb-2 mb-2">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">Jane Smith created an account</p>
                </div>
                <div>
                  <p className="text-sm font-medium">System update</p>
                  <p className="text-xs text-muted-foreground">The system will be updated tonight</p>
                </div>
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
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@purrfectpaw.com</p>
              </div>
              <div className="p-2">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2">
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2 text-red-500">
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
