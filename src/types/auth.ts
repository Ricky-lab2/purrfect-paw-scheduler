
export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  phone?: string;
  address?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  phone: string;
  address: string;
  pets: Pet[];
  appointments: any[];
};

export type Pet = {
  id: string;
  name: string;
  type: string;
  species: string;
  breed?: string;
  weight?: string;
  birthDate: string;
  gender: "male" | "female";
  ownerId: string;
};

export type Appointment = {
  id: string;
  petName: string;
  service: string;
  date: string;
  timeSlot: string;
  ownerName: string;
  ownerId: string;
};
