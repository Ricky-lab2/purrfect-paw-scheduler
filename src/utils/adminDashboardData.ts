import { supabase } from "@/integrations/supabase/client";

export const fetchAdminDashboardData = async () => {
  try {
    console.log('Fetching admin dashboard data...');
    
    // Use service role or bypass RLS by fetching with proper admin context
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch all data with explicit queries
    const [appointmentsResult, petsResult, profilesResult] = await Promise.all([
      supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
    ]);

    console.log('Fetch results:', {
      appointments: appointmentsResult,
      pets: petsResult,
      profiles: profilesResult
    });

    // Check for errors and return data
    if (appointmentsResult.error) {
      console.error('Appointments error:', appointmentsResult.error);
    }
    if (petsResult.error) {
      console.error('Pets error:', petsResult.error);
    }
    if (profilesResult.error) {
      console.error('Profiles error:', profilesResult.error);
    }

    return {
      appointments: appointmentsResult.data || [],
      pets: petsResult.data || [],
      profiles: profilesResult.data || [],
      appointmentsError: appointmentsResult.error,
      petsError: petsResult.error,
      profilesError: profilesResult.error
    };
  } catch (error) {
    console.error('Error in fetchAdminDashboardData:', error);
    throw error;
  }
};

export const calculateDashboardStats = (appointments: any[], pets: any[], profiles: any[]) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Filter current month data
  const currentAppointments = appointments.filter(apt => 
    new Date(apt.created_at) >= currentMonthStart
  );
  const currentPets = pets.filter(pet => 
    new Date(pet.created_at) >= currentMonthStart
  );
  const currentClients = profiles.filter(profile => 
    new Date(profile.created_at) >= currentMonthStart
  );

  // Filter last month data
  const lastMonthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.created_at);
    return aptDate >= lastMonthStart && aptDate <= lastMonthEnd;
  });
  const lastMonthPets = pets.filter(pet => {
    const petDate = new Date(pet.created_at);
    return petDate >= lastMonthStart && petDate <= lastMonthEnd;
  });
  const lastMonthClients = profiles.filter(profile => {
    const profileDate = new Date(profile.created_at);
    return profileDate >= lastMonthStart && profileDate <= lastMonthEnd;
  });

  // Calculate changes
  const appointmentsChange = lastMonthAppointments.length 
    ? Math.round(((currentAppointments.length - lastMonthAppointments.length) / lastMonthAppointments.length) * 100)
    : 0;
  const petsChange = lastMonthPets.length 
    ? Math.round(((currentPets.length - lastMonthPets.length) / lastMonthPets.length) * 100)
    : 0;
  const clientsChange = lastMonthClients.length 
    ? Math.round(((currentClients.length - lastMonthClients.length) / lastMonthClients.length) * 100)
    : 0;

  return {
    totalAppointments: currentAppointments.length,
    totalPets: currentPets.length,
    totalClients: currentClients.length,
    appointmentsChange,
    petsChange,
    clientsChange,
  };
};

export const processAppointmentsByStatus = (appointments: any[]) => {
  const statusCounts = appointments.reduce((acc: any, appointment: any) => {
    acc[appointment.status] = (acc[appointment.status] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    scheduled: '#3b82f6',
    completed: '#10b981',
    cancelled: '#ef4444',
    'in-progress': '#f59e0b'
  };

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count as number,
    color: statusColors[status as keyof typeof statusColors] || '#6b7280'
  }));
};

export const processAppointmentsByService = (appointments: any[]) => {
  const serviceCounts = appointments.reduce((acc: any, appointment: any) => {
    acc[appointment.service] = (acc[appointment.service] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(serviceCounts).map(([service, count]) => ({
    service: service.charAt(0).toUpperCase() + service.slice(1),
    count: count as number
  }));
};

export const processRecentActivity = (appointments: any[], profiles: any[], pets: any[]) => {
  const activities: any[] = [];
  
  // Add recent appointments
  appointments.slice(0, 10).forEach(appointment => {
    activities.push({
      id: `apt-${appointment.id}`,
      type: 'appointment',
      title: 'New appointment booked',
      description: `${appointment.owner_name} booked ${appointment.service} for ${appointment.pet_name}`,
      timestamp: appointment.created_at
    });
  });

  // Add recent profiles
  profiles.slice(0, 5).forEach(profile => {
    activities.push({
      id: `profile-${profile.id}`,
      type: 'registration',
      title: 'New client registered',
      description: `${profile.name} created a new account`,
      timestamp: profile.created_at
    });
  });

  // Add recent pets
  pets.slice(0, 5).forEach(pet => {
    activities.push({
      id: `pet-${pet.id}`,
      type: 'pet_added',
      title: 'Pet registered',
      description: `New ${pet.species} named ${pet.name} was added`,
      timestamp: pet.created_at
    });
  });

  // Sort by timestamp and return top 8
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);
};