
import { createContext, useContext, useState, ReactNode } from "react";

export type ServiceType = "checkup" | "vaccination" | "grooming" | "surgery" | "deworming";
export type TimeSlot = "morning" | "afternoon" | "evening";
export type PetGender = "male" | "female";

export type GroomingPackage = {
  id: string;
  name: string;
  price: string;
  description: string;
  services: string[];
};

interface AppointmentContextType {
  formData: {
    name: string;
    petName: string;
    petAge: string;
    petBirthDate: string;
    petGender: PetGender | "";
    email: string;
    phone: string;
    serviceType: ServiceType | "";
    date: string;
    timeSlot: TimeSlot | "";
    isUrgent: boolean;
    isFirstTime: boolean;
    additionalInfo: string;
    groomingPackage: string;
  };
  setFormValue: (field: string, value: any) => void;
  resetForm: () => void;
  setServiceTypeAndNavigate: (serviceType: ServiceType) => void;
}

const defaultFormData = {
  name: "",
  petName: "",
  petAge: "",
  petBirthDate: "",
  petGender: "" as PetGender | "",
  email: "",
  phone: "",
  serviceType: "" as ServiceType | "",
  date: "",
  timeSlot: "" as TimeSlot | "",
  isUrgent: false,
  isFirstTime: false,
  additionalInfo: "",
  groomingPackage: "",
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState({ ...defaultFormData });

  const setFormValue = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ ...defaultFormData });
  };

  const setServiceTypeAndNavigate = (serviceType: ServiceType) => {
    setFormValue("serviceType", serviceType);
    // Navigation will be handled in the component that calls this
  };

  return (
    <AppointmentContext.Provider value={{ 
      formData, 
      setFormValue, 
      resetForm,
      setServiceTypeAndNavigate
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error("useAppointment must be used within an AppointmentProvider");
  }
  return context;
};
