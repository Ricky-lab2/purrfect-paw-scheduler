
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, PawPrint, Users, TrendingUp, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

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
      
      // Calculate date ranges
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch current month stats
      const [
        currentAppointments,
        currentPets,
        currentClients,
        lastMonthAppointments,
        lastMonthPets,
        lastMonthClients,
        appointmentsByStatusData,
        appointmentsByServiceData,
        recentAppointmentsData,
        recentProfilesData,
        recentPetsData
      ] = await Promise.all([
        // Current month data
        supabase.from('appointments').select('*').gte('created_at', currentMonthStart.toISOString()),
        supabase.from('pets').select('*').gte('created_at', currentMonthStart.toISOString()),
        supabase.from('profiles').select('*').gte('created_at', currentMonthStart.toISOString()),
        
        // Last month data for comparison
        supabase.from('appointments').select('*')
          .gte('created_at', lastMonthStart.toISOString())
          .lte('created_at', lastMonthEnd.toISOString()),
        supabase.from('pets').select('*')
          .gte('created_at', lastMonthStart.toISOString())
          .lte('created_at', lastMonthEnd.toISOString()),
        supabase.from('profiles').select('*')
          .gte('created_at', lastMonthStart.toISOString())
          .lte('created_at', lastMonthEnd.toISOString()),
        
        // Additional analytics - get ALL appointments for charts
        supabase.from('appointments').select('status'),
        supabase.from('appointments').select('service'),
        
        // Recent activity data
        supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('pets').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      // Calculate changes
      const appointmentsChange = lastMonthAppointments.data?.length 
        ? Math.round(((currentAppointments.data?.length || 0) - lastMonthAppointments.data.length) / lastMonthAppointments.data.length * 100)
        : 0;
      
      const petsChange = lastMonthPets.data?.length 
        ? Math.round(((currentPets.data?.length || 0) - lastMonthPets.data.length) / lastMonthPets.data.length * 100)
        : 0;
      
      const clientsChange = lastMonthClients.data?.length 
        ? Math.round(((currentClients.data?.length || 0) - lastMonthClients.data.length) / lastMonthClients.data.length * 100)
        : 0;

      setStats({
        totalAppointments: currentAppointments.data?.length || 0,
        totalPets: currentPets.data?.length || 0,
        totalClients: currentClients.data?.length || 0,
        appointmentsChange,
        petsChange,
        clientsChange,
      });

      // Process appointments by status
      const statusCounts = appointmentsByStatusData.data?.reduce((acc: any, appointment: any) => {
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const statusColors = {
        scheduled: '#3b82f6',
        completed: '#10b981',
        cancelled: '#ef4444',
        'in-progress': '#f59e0b'
      };

      setAppointmentsByStatus(
        Object.entries(statusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count as number,
          color: statusColors[status as keyof typeof statusColors] || '#6b7280'
        }))
      );

      // Process appointments by service
      const serviceCounts = appointmentsByServiceData.data?.reduce((acc: any, appointment: any) => {
        acc[appointment.service] = (acc[appointment.service] || 0) + 1;
        return acc;
      }, {}) || {};

      setAppointmentsByService(
        Object.entries(serviceCounts).map(([service, count]) => ({
          service: service.charAt(0).toUpperCase() + service.slice(1),
          count: count as number
        }))
      );

      // Process recent activity
      const activities: RecentActivity[] = [];
      
      recentAppointmentsData.data?.forEach(appointment => {
        activities.push({
          id: `apt-${appointment.id}`,
          type: 'appointment',
          title: 'New appointment booked',
          description: `${appointment.owner_name} booked ${appointment.service} for ${appointment.pet_name}`,
          timestamp: appointment.created_at
        });
      });

      recentProfilesData.data?.forEach(profile => {
        activities.push({
          id: `profile-${profile.id}`,
          type: 'registration',
          title: 'New client registered',
          description: `${profile.name} created a new account`,
          timestamp: profile.created_at
        });
      });

      recentPetsData.data?.forEach(pet => {
        activities.push({
          id: `pet-${pet.id}`,
          type: 'pet_added',
          title: 'Pet registered',
          description: `New ${pet.species} named ${pet.name} was added`,
          timestamp: pet.created_at
        });
      });

      // Sort by timestamp and take most recent
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 8));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
