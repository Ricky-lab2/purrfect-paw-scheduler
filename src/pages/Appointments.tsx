
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAppointments, Appointment as AppointmentType } from "@/utils/localStorageDB";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Info, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      try {
        const allAppointments = getAppointments();
        const userAppointments = allAppointments.filter(
          appointment => appointment.email.toLowerCase() === user.userInfo.email.toLowerCase()
        );
        setAppointments(userAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "checkup":
        return <span className="text-blue-500">🩺</span>;
      case "vaccination":
        return <span className="text-green-500">💉</span>;
      case "grooming":
        return <span className="text-purple-500">✂️</span>;
      case "surgery":
        return <span className="text-red-500">🔪</span>;
      case "deworming":
        return <span className="text-orange-500">💊</span>;
      default:
        return <span className="text-gray-500">🐾</span>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center p-12">
            <h1 className="text-2xl font-semibold mb-4">Please log in to view your appointments</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <Link to="/appointment">
            <Button className="bg-pet-blue-dark hover:bg-pet-blue-dark/90">Book New Appointment</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4">Loading your appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pet-blue/20 flex items-center justify-center text-xl">
                        {getServiceIcon(appointment.service)}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className="capitalize">{appointment.service}</span>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          For {appointment.petName} 
                          {appointment.petGender && <span> ({appointment.petGender})</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(appointment.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {appointment.time} ({appointment.timeSlot})
                      </span>
                    </div>
                    
                    {appointment.groomingPackage && (
                      <div className="flex items-center gap-2 md:col-span-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Package: {appointment.groomingPackage === 'basic' ? 'Basic Grooming' : 
                                   appointment.groomingPackage === 'premium' ? 'Premium Grooming' : 
                                   'Deluxe Spa Package'}
                        </span>
                      </div>
                    )}
                    
                    {appointment.additionalInfo && (
                      <div className="flex items-start gap-2 md:col-span-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-sm">
                          Additional information: {appointment.additionalInfo}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center bg-pet-gray dark:bg-gray-800 p-12 rounded-lg">
            <div className="w-16 h-16 bg-pet-blue/20 rounded-full mx-auto flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-pet-blue-dark" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No appointments found</h2>
            <p className="text-muted-foreground mb-6">You haven't booked any appointments yet.</p>
            <Link to="/appointment">
              <Button className="bg-pet-blue-dark hover:bg-pet-blue-dark/90">Book Your First Appointment</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
