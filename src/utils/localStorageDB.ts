const APPOINTMENTS_KEY = "appointments";

export const getAppointments = () => {
  try {
    const appointments = localStorage.getItem(APPOINTMENTS_KEY);
    return appointments ? JSON.parse(appointments) : [];
  } catch (error) {
    console.error("Error getting appointments from localStorage:", error);
    return [];
  }
};

// Add petSpecies to the appointment type
export type Appointment = {
  id: string;
  petName: string;
  petAge: string;
  petGender: string;
  petSpecies: string; // Added pet species field
  ownerName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time?: string;
  timeSlot?: string;
  additionalInfo?: string;
  status: string;
  createdAt: number;
  isUrgent?: boolean;
  isFirstTime?: boolean;
};

type AppointmentInput = Omit<Appointment, "id" | "status" | "createdAt">;

export const updateAppointmentStatus = (id: string, status: string) => {
  const appointments = getAppointments();
  const appointmentIndex = appointments.findIndex((apt) => apt.id === id);

  if (appointmentIndex === -1) {
    console.error(`Appointment with id ${id} not found`);
    return false;
  }

  appointments[appointmentIndex] = {
    ...appointments[appointmentIndex],
    status: status,
  };

  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  return true;
};

export const saveAppointment = (appointment: AppointmentInput): Appointment => {
  const appointments = getAppointments();
  
  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    ...appointment,
    status: "Pending",
    createdAt: Date.now()
  };
  
  appointments.push(newAppointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  
  return newAppointment;
};

export const deleteAppointment = (id: string) => {
  const appointments = getAppointments();
  const updatedAppointments = appointments.filter((apt) => apt.id !== id);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
};
