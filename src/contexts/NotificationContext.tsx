
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [currentNotification, setCurrentNotification] = useState<Appointment | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = (appointment: Appointment) => {
    setCurrentNotification(appointment);
    setIsVisible(true);
  };

  const hideNotification = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentNotification(null), 300); // Allow fade out animation
  };

  return (
    <NotificationContext.Provider value={{
      showNotification,
      hideNotification,
      currentNotification,
      isVisible
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
