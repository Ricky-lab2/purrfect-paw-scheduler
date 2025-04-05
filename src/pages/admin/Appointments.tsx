
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

// Sample data
const appointmentsData = [
  {
    id: "APT001",
    petName: "Max",
    ownerName: "John Doe",
    service: "Checkup",
    date: "2025-04-06",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: "APT002",
    petName: "Luna",
    ownerName: "Sarah Johnson",
    service: "Vaccination",
    date: "2025-04-06",
    time: "11:30 AM",
    status: "Completed",
  },
  {
    id: "APT003",
    petName: "Bella",
    ownerName: "Michael Smith",
    service: "Grooming",
    date: "2025-04-06",
    time: "2:00 PM",
    status: "Pending",
  },
  {
    id: "APT004",
    petName: "Charlie",
    ownerName: "Jessica Williams",
    service: "Dental Cleaning",
    date: "2025-04-07",
    time: "9:30 AM",
    status: "Confirmed",
  },
  {
    id: "APT005",
    petName: "Daisy",
    ownerName: "David Brown",
    service: "Surgery",
    date: "2025-04-07",
    time: "1:00 PM",
    status: "Pending",
  },
];

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredAppointments = appointmentsData.filter(appointment => {
    // Filter by search term
    const searchMatch = 
      appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      appointment.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const statusMatch = filterStatus === "All" || appointment.status === filterStatus;

    return searchMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pet-blue-dark text-white hover:bg-pet-blue-dark/90 h-10 px-4 py-2">
          <Calendar className="mr-2 h-4 w-4" />
          New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search appointments..."
            className="pl-10 pr-4 py-2 w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-pet-blue-dark dark:bg-gray-800 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <option value="all">All Services</option>
          <option value="checkup">Checkup</option>
          <option value="vaccination">Vaccination</option>
          <option value="grooming">Grooming</option>
          <option value="surgery">Surgery</option>
          <option value="deworming">Deworming</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="border rounded-md dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Pet</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.id}</TableCell>
                <TableCell>{appointment.petName}</TableCell>
                <TableCell>{appointment.ownerName}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </TableCell>
                <TableCell>
                  <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {filteredAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Appointments;
