
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Appointment {
  petName: string;
  service: string;
  date: string;
  timeSlot: string;
  ownerName: string;
}

interface NotificationContextType {
  showNotification: (appointment: Appointment) => void;
  hideNotification: () => void;
  currentNotification: Appointment | null;
  isVisible: boolean;
  hasUnreadNotifications: boolean;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [currentNotification, setCurrentNotification] = useState<Appointment | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const { isAuthenticated, getUserAppointments, getUserPets } = useAuth();

  // Check for real-time notifications
  useEffect(() => {
    if (!isAuthenticated) {
      setHasUnreadNotifications(false);
      return;
    }

    const checkForNotifications = async () => {
      try {
        const appointments = await getUserAppointments();
        const pets = await getUserPets();
        const now = new Date();
        
        // Check for upcoming appointments within 24 hours
        const upcomingAppointments = appointments.filter(apt => {
          const appointmentDate = new Date(apt.date);
          const timeDiff = appointmentDate.getTime() - now.getTime();
          const hoursDiff = timeDiff / (1000 * 3600);
          return hoursDiff > 0 && hoursDiff <= 24;
        });

        // Check for pets needing vaccinations
        const petsNeedingVaccination = pets.filter(pet => {
          const birthDate = new Date(pet.birthDate);
          const ageInMonths = (now.getTime() - birthDate.getTime()) / (1000 * 3600 * 24 * 30);
          return ageInMonths >= 6;
        });

        const hasNotifications = upcomingAppointments.length > 0 || petsNeedingVaccination.length > 0 || pets.length > 0;
        setHasUnreadNotifications(hasNotifications);
        
        console.log("Notification check:", {
          upcomingAppointments: upcomingAppointments.length,
          petsNeedingVaccination: petsNeedingVaccination.length,
          totalPets: pets.length,
          hasNotifications
        });
        
      } catch (error) {
        console.error("Error checking notifications:", error);
      }
    };

    checkForNotifications();
    
    // Check every minute for real-time updates
    const interval = setInterval(checkForNotifications, 60000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, getUserAppointments, getUserPets]);

  const showNotification = (appointment: Appointment) => {
    setCurrentNotification(appointment);
    setIsVisible(true);
  };

  const hideNotification = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentNotification(null), 300); // Allow fade out animation
  };

  const markAllAsRead = () => {
    setHasUnreadNotifications(false);
  };

  return (
    <NotificationContext.Provider value={{
      showNotification,
      hideNotification,
      currentNotification,
      isVisible,
      hasUnreadNotifications,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
