import { useState, useEffect, memo, useCallback } from "react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { DoctorCommunication } from "@/components/DoctorCommunication";
import { FAQSection } from "@/components/FAQSection";
import { CheckCircle2, Search } from "lucide-react";
import { getAppointments, Appointment as AppointmentType } from "@/utils/localStorageDB";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

// Memoized components for better performance
const AppointmentCard = memo(({ apt, getSpeciesIcon, getStatusColor }: {
  apt: AppointmentType;
  getSpeciesIcon: (species: string | undefined) => string;
  getStatusColor: (status: string) => string;
}) => (
  <div key={apt.id} className="p-3 border rounded-lg">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium">
          {apt.petName} {getSpeciesIcon(apt.petSpecies)} - {apt.service}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(apt.date).toLocaleDateString()} at {apt.time || apt.timeSlot}
        </p>
        {apt.diagnosis && (
          <p className="text-xs text-muted-foreground mt-1">
            Reason: {apt.diagnosis}
          </p>
        )}
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
        {apt.status}
      </span>
    </div>
  </div>
));

const ServiceCard = memo(({ title, description, gradient }: {
  title: string;
  description: string;
  gradient: string;
}) => (
  <div className={`p-3 border rounded-lg ${gradient}`}>
    <h4 className="font-medium">{title}</h4>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
));

const Appointment = memo(() => {
  const [userAppointments, setUserAppointments] = useState<AppointmentType[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  // Memoized functions to prevent recreating on every render
  const getSpeciesIcon = useCallback((species: string | undefined) => {
    if (!species) return "🐾";
    
    if (species.startsWith("reptile:")) {
      const reptileType = species.substring(8);
      switch(reptileType) {
        case "snake": return "🐍";
        case "lizard": return "🦎";
        case "turtle": return "🐢";
        case "gecko": return "🦎";
        case "iguana": return "🦎";
        default: return "🦎";
      }
    }
    
    if (species.startsWith("other:")) return "🐾";
    
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
  }, []);
  
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  }, []);
  
  const checkAppointments = useCallback((email: string) => {
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
  }, []);
  
  // Automatically set the email from the authenticated user
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      checkAppointments(user.email);
    }
  }, [isAuthenticated, user?.email, checkAppointments]);
  
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
              Schedule a visit for your pet with our comprehensive booking system. Get instant consultations and expert care.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            <AppointmentForm />
            <DoctorCommunication />
          </div>
          
          {/* Right Column - Info & FAQ */}
          <div className="space-y-6">
            {/* Your Recent Appointments */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-medium mb-4">Your Recent Appointments</h3>
              <div className="space-y-4">
                {userAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {userAppointments.slice(0, 3).map((apt) => (
                      <AppointmentCard 
                        key={apt.id}
                        apt={apt}
                        getSpeciesIcon={getSpeciesIcon}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                    
                    {userAppointments.length > 3 && (
                      <div className="text-center mt-2">
                        <a href="/my-appointments" className="text-sm text-pet-blue-dark hover:underline">
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

            {/* FAQ Section */}
            <FAQSection />
            
            {/* Additional Services */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-medium mb-4">Additional Services</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Besides appointments, we offer these additional services for your pet:
                </p>
                
                <div className="space-y-4">
                  <ServiceCard 
                    title="Pet Grooming Packages"
                    description="Complete grooming services starting from ₱2,000"
                    gradient="bg-gradient-to-r from-blue-50 to-blue-100"
                  />
                  
                  <ServiceCard 
                    title="Pet Dental Care"
                    description="Professional teeth cleaning and oral care from ₱1,500"
                    gradient="bg-gradient-to-r from-green-50 to-green-100"
                  />
                  
                  <ServiceCard 
                    title="Pet Boarding"
                    description="Safe and comfortable boarding facilities from ₱800/night"
                    gradient="bg-gradient-to-r from-purple-50 to-purple-100"
                  />
                </div>
                
                <div className="mt-4 text-center">
                  <a href="/services" className="text-pet-blue-dark hover:underline text-sm">
                    Learn more about our services →
                  </a>
                </div>
              </div>
            </div>
            
            {/* Appointment Information */}
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
            
            {/* Preparing for Your Visit */}
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
});

Appointment.displayName = 'Appointment';

export default Appointment;
