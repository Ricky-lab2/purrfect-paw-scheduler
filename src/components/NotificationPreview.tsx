
import { useState, useEffect } from "react";
import { Bell, X, Calendar, Clock } from "lucide-react";

interface Appointment {
  petName: string;
  service: string;
  date: string;
  timeSlot: string;
  ownerName: string;
}

interface NotificationPreviewProps {
  show?: boolean;
  appointment?: Appointment | null;
  onClose?: () => void;
}

export function NotificationPreview({
  show = false,
  appointment,
  onClose,
}: NotificationPreviewProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (!isVisible || !appointment) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="bg-gradient-to-r from-pet-blue to-pet-teal p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bell className="text-white" size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium">Appointment Confirmed!</h3>
            <p className="text-white/80 text-sm">Your booking was successful</p>
          </div>
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={handleClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Hi {appointment.ownerName}, your appointment for {appointment.petName} has been confirmed.
          </p>
          
          <div className="bg-pet-gray dark:bg-gray-800 rounded-lg p-3 mb-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Service:</span>
                <span className="text-gray-600 dark:text-gray-400">{appointment.service}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Date:</span>
                <span className="text-gray-600 dark:text-gray-400">{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Time:</span>
                <span className="text-gray-600 dark:text-gray-400">{appointment.timeSlot}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <button 
              onClick={handleClose}
              className="text-xs text-pet-blue-dark dark:text-pet-blue font-medium hover:underline"
            >
              View Details
            </button>
            <button 
              onClick={handleClose}
              className="text-xs px-3 py-1.5 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
