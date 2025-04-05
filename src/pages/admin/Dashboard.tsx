
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, PawPrint, Users } from "lucide-react";

const Dashboard = () => {
  // Sample data for demonstration
  const stats = [
    { 
      title: "Total Appointments", 
      value: "124", 
      change: "+5%", 
      icon: Calendar, 
      color: "bg-blue-500" 
    },
    { 
      title: "Registered Pets", 
      value: "254", 
      change: "+12%", 
      icon: PawPrint, 
      color: "bg-green-500" 
    },
    { 
      title: "Active Clients", 
      value: "189", 
      change: "+8%", 
      icon: Users, 
      color: "bg-orange-500" 
    },
    { 
      title: "Monthly Revenue", 
      value: "₱58,400", 
      change: "+14%", 
      icon: DollarSign, 
      color: "bg-purple-500" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border rounded-md text-sm">
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-full text-white`}>
                <stat.icon size={16} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.change}</span> since last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">New appointment booked</h4>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <p className="text-sm text-muted-foreground">John Doe booked a checkup appointment for Max</p>
            </div>
            <div className="border-b pb-3">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">New client registered</h4>
                <span className="text-xs text-muted-foreground">5 hours ago</span>
              </div>
              <p className="text-sm text-muted-foreground">Sarah Johnson created a new account</p>
            </div>
            <div className="border-b pb-3">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">Payment received</h4>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </div>
              <p className="text-sm text-muted-foreground">₱2,500 payment for grooming services</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">Appointment completed</h4>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </div>
              <p className="text-sm text-muted-foreground">Vet checkup for Luna completed by Dr. Martinez</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
