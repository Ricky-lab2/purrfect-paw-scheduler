
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
      console.log('Fetching dashboard data...');
      
      // Calculate date ranges
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch ALL data first, then filter for stats
      const [
        allAppointments,
        allPets,
        allProfiles,
        recentAppointmentsData,
        recentProfilesData,
        recentPetsData
      ] = await Promise.all([
        // Get ALL data with better error handling
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('pets').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        
        // Recent activity data
        supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('pets').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      console.log('Fetched data:', {
        appointments: allAppointments.data?.length || 0,
        pets: allPets.data?.length || 0,
        profiles: allProfiles.data?.length || 0
      });

      // Check for errors
      if (allAppointments.error) {
        console.error('Appointments fetch error:', allAppointments.error);
        throw allAppointments.error;
      }
      if (allPets.error) {
        console.error('Pets fetch error:', allPets.error);
        throw allPets.error;
      }
      if (allProfiles.error) {
        console.error('Profiles fetch error:', allProfiles.error);
        throw allProfiles.error;
      }

      // Filter data by date ranges for stats
      const currentAppointments = allAppointments.data?.filter(apt => 
        new Date(apt.created_at) >= currentMonthStart
      ) || [];
      
      const currentPets = allPets.data?.filter(pet => 
        new Date(pet.created_at) >= currentMonthStart
      ) || [];
      
      const currentClients = allProfiles.data?.filter(profile => 
        new Date(profile.created_at) >= currentMonthStart
      ) || [];

      const lastMonthAppointments = allAppointments.data?.filter(apt => {
        const aptDate = new Date(apt.created_at);
        return aptDate >= lastMonthStart && aptDate <= lastMonthEnd;
      }) || [];
      
      const lastMonthPets = allPets.data?.filter(pet => {
        const petDate = new Date(pet.created_at);
        return petDate >= lastMonthStart && petDate <= lastMonthEnd;
      }) || [];
      
      const lastMonthClients = allProfiles.data?.filter(profile => {
        const profileDate = new Date(profile.created_at);
        return profileDate >= lastMonthStart && profileDate <= lastMonthEnd;
      }) || [];

      // Calculate changes
      const appointmentsChange = lastMonthAppointments.length 
        ? Math.round(((currentAppointments.length || 0) - lastMonthAppointments.length) / lastMonthAppointments.length * 100)
        : 0;
      
      const petsChange = lastMonthPets.length 
        ? Math.round(((currentPets.length || 0) - lastMonthPets.length) / lastMonthPets.length * 100)
        : 0;
      
      const clientsChange = lastMonthClients.length 
        ? Math.round(((currentClients.length || 0) - lastMonthClients.length) / lastMonthClients.length * 100)
        : 0;

      setStats({
        totalAppointments: currentAppointments.length || 0,
        totalPets: currentPets.length || 0,
        totalClients: currentClients.length || 0,
        appointmentsChange,
        petsChange,
        clientsChange,
      });

      // Process appointments by status using ALL appointments
      const statusCounts = allAppointments.data?.reduce((acc: any, appointment: any) => {
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

      // Process appointments by service using ALL appointments
      const serviceCounts = allAppointments.data?.reduce((acc: any, appointment: any) => {
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
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data. Please try refreshing the page.",
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
