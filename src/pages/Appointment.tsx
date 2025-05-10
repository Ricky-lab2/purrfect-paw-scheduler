
import { useState, useEffect } from "react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { CheckCircle2, Search } from "lucide-react";
import { getAppointments, Appointment as AppointmentType } from "@/utils/localStorageDB";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

const Appointment = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userAppointments, setUserAppointments] = useState<AppointmentType[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  // Automatically set the email from the authenticated user
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setUserEmail(user.email);
      checkAppointments(user.email);
    }
  }, [isAuthenticated, user]);
  
  const checkAppointments = (email: string = userEmail) => {
    if (!email) return;
    
    setIsChecking(true);
    try {
      const appointments = getAppointments().filter(
        apt => apt.email.toLowerCase() === email.toLowerCase()
      );
      setUserAppointments(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsChecking(false);
    }
  };
  
  // Get species icon based on pet type
  const getSpeciesIcon = (species: string) => {
    switch(species) {
      case "dog": return "🐕";
      case "cat": return "🐈"; 
      case "bird": return "🦜";
      case "rabbit": return "🐇";
      case "hamster": return "🐹";
      case "fish": return "🐠";
      case "reptile": return "🦎";
      default: return "🐾";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please login to book an appointment",
      variant: "destructive",
    });
    
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen pt-20">
      {/* Page Header */}
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Book an Appointment</h1>
            <p className="text-lg text-muted-foreground">
              Schedule a visit for your pet with our easy-to-use booking system. We'll confirm your appointment shortly.
            </p>
          </div>
        </div>
      </section>
      
      {/* Appointment Form Section */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AppointmentForm />
          </div>
          
          <div className="space-y-6">
            {/* Check Existing Appointments */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-medium mb-4">Your Appointments</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Here's a quick view of your recent appointments.
                </p>
                
                {userAppointments.length > 0 ? (
                  <div className="space-y-3 mt-4">
                    {userAppointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {apt.petName} {apt.petSpecies && getSpeciesIcon(apt.petSpecies)} - {apt.service}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(apt.date).toLocaleDateString()} at {apt.time}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {userAppointments.length > 3 && (
                      <div className="text-center mt-2">
                        <a href="/user/appointments" className="text-sm text-pet-blue-dark hover:underline">
                          View all appointments →
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">You don't have any appointments yet.</p>
                )}
              </div>
            </div>
            
            <div className="card-glass p-6">
              <h3 className="text-xl font-medium mb-4">Appointment Information</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Schedule an appointment for your pet's checkup, vaccination, grooming, or other services. Our team will confirm your appointment via email or phone.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-blue-dark shrink-0 mt-0.5" size={18} />
                    <p className="text-sm">
                      <span className="font-medium">Confirmation:</span> You'll receive a confirmation email within 2 hours.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-blue-dark shrink-0 mt-0.5" size={18} />
                    <p className="text-sm">
                      <span className="font-medium">Reminders:</span> We'll send you a reminder 24 hours before your appointment.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-blue-dark shrink-0 mt-0.5" size={18} />
                    <p className="text-sm">
                      <span className="font-medium">Rescheduling:</span> Need to reschedule? Please give us at least 24 hours notice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-glass p-6">
              <h3 className="text-xl font-medium mb-4">Preparing for Your Visit</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  To ensure a smooth and effective appointment, please:
                </p>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>Arrive 10-15 minutes before your scheduled time</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>Bring any previous medical records if you're a new patient</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>Keep dogs on leashes and cats in carriers</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>Bring a list of questions or concerns you'd like to discuss</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>For grooming appointments, let us know of any specific requests</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
