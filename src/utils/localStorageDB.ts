// Function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Define types for the data
export type PetGender = "male" | "female";
export type ServiceType = "checkup" | "vaccination" | "grooming" | "surgery" | "deworming";
export type TimeSlot = "morning" | "afternoon" | "evening";

export interface Appointment {
  id: string;
  petName: string;
  ownerName: string;
  petAge: string;
  petGender: PetGender;
  email: string;
  phone: string;
  service: ServiceType;
  date: string;
  time: string;
  timeSlot: TimeSlot;
  additionalInfo: string;
  isUrgent: boolean;
  isFirstTime: boolean;
  groomingPackage?: string;
  status: string;
  createdAt: string;
}

export interface Pet {
  id: string;
  name: string;
  birthDate: string;
  gender: PetGender;
  breed: string;
  ownerId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  pets: Pet[];
}

// Function to get appointments from local storage
export function getAppointments(): Appointment[] {
  const appointments = localStorage.getItem("appointments");
  return appointments ? JSON.parse(appointments) : [];
}

// Function to get pets from local storage
export function getPets(): Pet[] {
  const pets = localStorage.getItem("pets");
  return pets ? JSON.parse(pets) : [];
}

// Function to get users from local storage
export function getUsers(): User[] {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

export function saveAppointment(appointmentData: Omit<Appointment, "id" | "status" | "time" | "createdAt" | "groomingPackage"> & { groomingPackage?: string }): Appointment {
  // Get existing appointments
  const appointments = getAppointments();

  // Create a formatted time string based on the timeSlot
  let time: string;
  switch (appointmentData.timeSlot) {
    case "morning":
      time = "9:00 AM";
      break;
    case "afternoon":
      time = "1:00 PM";
      break;
    case "evening":
      time = "5:00 PM";
      break;
    default:
      time = "9:00 AM";
  }

  // Create new appointment with generated ID and defaults
  const newAppointment: Appointment = {
    ...appointmentData,
    id: generateId(),
    status: "Pending",
    time,
    createdAt: new Date().toISOString(),
    groomingPackage: appointmentData.groomingPackage || undefined,
  };

  // Save to localStorage
  localStorage.setItem("appointments", JSON.stringify([...appointments, newAppointment]));

  return newAppointment;
}

// Function to save a pet to local storage
export function savePet(petData: Omit<Pet, "id">): Pet {
  const pets = getPets();
  const newPet: Pet = {
    ...petData,
    id: generateId(),
  };
  localStorage.setItem("pets", JSON.stringify([...pets, newPet]));
  return newPet;
}

// Function to save a user to local storage
export function saveUser(userData: Omit<User, "id">): User {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: generateId(),
  };
  localStorage.setItem("users", JSON.stringify([...users, newUser]));
  return newUser;
}
