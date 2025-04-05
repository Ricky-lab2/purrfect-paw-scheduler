
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";
import { useState } from "react";

// Sample data
const usersData = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+63 912 345 6789",
    role: "Client",
    status: "Active",
    joinedOn: "2024-12-10",
  },
  {
    id: "USR002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+63 923 456 7890",
    role: "Client",
    status: "Active",
    joinedOn: "2025-01-15",
  },
  {
    id: "USR003",
    name: "Dr. Michael Smith",
    email: "dr.smith@example.com",
    phone: "+63 934 567 8901",
    role: "Veterinarian",
    status: "Active",
    joinedOn: "2024-10-05",
  },
  {
    id: "USR004",
    name: "Jessica Williams",
    email: "j.williams@example.com",
    phone: "+63 945 678 9012",
    role: "Client",
    status: "Inactive",
    joinedOn: "2025-02-20",
  },
  {
    id: "USR005",
    name: "Dr. Emily Davis",
    email: "emily.d@example.com",
    phone: "+63 956 789 0123",
    role: "Veterinarian",
    status: "Active",
    joinedOn: "2024-11-12",
  },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredUsers = usersData.filter(user => {
    // Filter by search term
    const searchMatch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by role
    const roleMatch = filterRole === "All" || user.role === filterRole;
    
    // Filter by status
    const statusMatch = filterStatus === "All" || user.status === filterStatus;

    return searchMatch && roleMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pet-blue-dark text-white hover:bg-pet-blue-dark/90 h-10 px-4 py-2">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-pet-blue-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border rounded-md"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Client">Clients</option>
          <option value="Veterinarian">Veterinarians</option>
          <option value="Admin">Admins</option>
          <option value="Staff">Staff</option>
        </select>
        <select
          className="px-3 py-2 border rounded-md"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined On</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.joinedOn}</TableCell>
                <TableCell>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
