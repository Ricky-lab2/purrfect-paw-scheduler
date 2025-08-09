
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, PawPrint, Users, TrendingUp, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalAppointments: number;
  totalPets: number;
  totalClients: number;
  appointmentsChange: number;
  petsChange: number;
  clientsChange: number;
}

interface AppointmentsByStatus {
  name: string;
  value: number;
  color: string;
}

interface AppointmentsByService {
  service: string;
  count: number;
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'registration' | 'pet_added';
  title: string;
  description: string;
  timestamp: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    totalPets: 0,
    totalClients: 0,
    appointmentsChange: 0,
    petsChange: 0,
    clientsChange: 0,
  });
  const [appointmentsByStatus, setAppointmentsByStatus] = useState<AppointmentsByStatus[]>([]);
  const [appointmentsByService, setAppointmentsByService] = useState<AppointmentsByService[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("thisMonth");

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Hardcoded data - simple static values for testing
      const hardcodedStats = {
        totalAppointments: 125,
        totalPets: 89,
        totalClients: 67,
        appointmentsChange: 12,
        petsChange: 8,
        clientsChange: 15,
      };
      
      const hardcodedStatusData = [
        { name: "Scheduled", value: 45, color: "#3b82f6" },
        { name: "Completed", value: 65, color: "#10b981" },
        { name: "Cancelled", value: 15, color: "#ef4444" }
      ];
      
      const hardcodedServiceData = [
        { service: "Vaccination", count: 35 },
        { service: "Check-up", count: 28 },
        { service: "Surgery", count: 18 },
        { service: "Dental", count: 22 },
        { service: "Emergency", count: 12 }
      ];
      
      const hardcodedActivity = [
        {
          id: "1",
          type: "appointment" as const,
          title: "New appointment scheduled",
          description: "Vaccination appointment for Max",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: "2", 
          type: "registration" as const,
          title: "New client registered",
          description: "Sarah Johnson joined the clinic",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
          id: "3",
          type: "pet_added" as const,
          title: "New pet registered",
          description: "Luna (Cat) added to the system",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
        }
      ];
      
      setStats(hardcodedStats);
      setAppointmentsByStatus(hardcodedStatusData);
      setAppointmentsByService(hardcodedServiceData);
      setRecentActivity(hardcodedActivity);
      
    } catch (error) {
      console.error('Error setting dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscription for appointments
    const appointmentsChannel = supabase
      .channel('appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Real-time appointment change:', payload);
          fetchDashboardData(); // Refresh data when appointments change
        }
      )
      .subscribe();

    // Set up real-time subscription for pets
    const petsChannel = supabase
      .channel('pets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pets'
        },
        (payload) => {
          console.log('Real-time pets change:', payload);
          fetchDashboardData(); // Refresh data when pets change
        }
      )
      .subscribe();

    // Set up real-time subscription for profiles
    const profilesChannel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Real-time profiles change:', payload);
          fetchDashboardData(); // Refresh data when profiles change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(petsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [timeRange]);

  const statCards = [
    { 
      title: "Total Appointments", 
      value: stats.totalAppointments.toString(), 
      change: `${stats.appointmentsChange > 0 ? '+' : ''}${stats.appointmentsChange}%`, 
      icon: Calendar, 
      color: "bg-primary" 
    },
    { 
      title: "Registered Pets", 
      value: stats.totalPets.toString(), 
      change: `${stats.petsChange > 0 ? '+' : ''}${stats.petsChange}%`, 
      icon: PawPrint, 
      color: "bg-green-500" 
    },
    { 
      title: "Active Clients", 
      value: stats.totalClients.toString(), 
      change: `${stats.clientsChange > 0 ? '+' : ''}${stats.clientsChange}%`, 
      icon: Users, 
      color: "bg-orange-500" 
    },
    { 
      title: "Growth Rate", 
      value: `${Math.round((stats.appointmentsChange + stats.petsChange + stats.clientsChange) / 3)}%`, 
      change: "avg growth", 
      icon: TrendingUp, 
      color: "bg-purple-500" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your pet care business.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-full text-white`}>
                <stat.icon size={16} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`${stat.change.includes('+') || stat.change.includes('avg') ? 'text-green-500' : stat.change.includes('-') ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {isLoading ? "..." : stat.change}
                </span> since last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={20} />
              Appointments by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                scheduled: { label: "Scheduled", color: "hsl(var(--primary))" },
                completed: { label: "Completed", color: "hsl(var(--success))" },
                cancelled: { label: "Cancelled", color: "hsl(var(--destructive))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {appointmentsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Appointments by Service Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Popular Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Appointments", color: "hsl(var(--primary))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentsByService}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="service" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity size={20} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse border-b pb-3">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity.id} className={`${index < recentActivity.length - 1 ? 'border-b' : ''} pb-3`}>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
