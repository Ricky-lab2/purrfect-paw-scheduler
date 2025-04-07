
// Types for our booking data
export interface Appointment {
  id: string;
  petName: string;
  ownerName: string;
  petAge: string;
  petGender: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  time: string; // For display purposes
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  additionalInfo?: string;
  isUrgent?: boolean;
  isFirstTime?: boolean;
  createdAt: string;
}

// Generate a simple ID
export const generateId = (): string => {
  return `APT${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

// Get all appointments
export const getAppointments = (): Appointment[] => {
  try {
    const appointments = localStorage.getItem('appointments');
    return appointments ? JSON.parse(appointments) : [];
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
};

// Save an appointment
export const saveAppointment = (appointment: Omit<Appointment, 'id' | 'status' | 'time' | 'createdAt'>): Appointment => {
  try {
    const appointments = getAppointments();
    
    // Map timeSlot to display time
    const timeMap: Record<string, string> = {
      morning: '9:00 AM',
      afternoon: '1:00 PM',
      evening: '5:00 PM'
    };
    
    const newAppointment: Appointment = {
      ...appointment,
      id: generateId(),
      status: 'Pending',
      time: timeMap[appointment.timeSlot as keyof typeof timeMap] || '9:00 AM',
      createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    return newAppointment;
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw error;
  }
};

// Update an appointment status
export const updateAppointmentStatus = (id: string, status: Appointment['status']): boolean => {
  try {
    const appointments = getAppointments();
    const index = appointments.findIndex(apt => apt.id === id);
    
    if (index !== -1) {
      appointments[index].status = status;
      localStorage.setItem('appointments', JSON.stringify(appointments));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return false;
  }
};

// Delete an appointment
export const deleteAppointment = (id: string): boolean => {
  try {
    const appointments = getAppointments();
    const filteredAppointments = appointments.filter(apt => apt.id !== id);
    
    if (filteredAppointments.length !== appointments.length) {
      localStorage.setItem('appointments', JSON.stringify(filteredAppointments));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
};

// Seed some initial appointment data if none exists
export const seedInitialData = (): void => {
  if (getAppointments().length === 0) {
    const sampleAppointments: Omit<Appointment, 'id' | 'status' | 'time' | 'createdAt'>[] = [
      {
        petName: "Max",
        ownerName: "John Doe",
        petAge: "3 years",
        petGender: "male",
        email: "john@example.com",
        phone: "555-1234",
        service: "checkup",
        date: "2025-04-06",
        timeSlot: "morning",
        additionalInfo: "Annual checkup"
      },
      {
        petName: "Luna",
        ownerName: "Sarah Johnson",
        petAge: "2 years",
        petGender: "female",
        email: "sarah@example.com",
        phone: "555-5678",
        service: "vaccination",
        date: "2025-04-06",
        timeSlot: "afternoon",
        isFirstTime: true
      },
      {
        petName: "Charlie",
        ownerName: "Michael Smith",
        petAge: "5 years",
        petGender: "male",
        email: "michael@example.com",
        phone: "555-9012",
        service: "grooming",
        date: "2025-04-07",
        timeSlot: "evening"
      }
    ];
    
    sampleAppointments.forEach(apt => saveAppointment(apt));
  }
};
