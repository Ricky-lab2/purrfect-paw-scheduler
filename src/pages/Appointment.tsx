
import { useState, useEffect } from "react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { CheckCircle2, Search, LogIn } from "lucide-react";
import { getAppointments, Appointment as AppointmentType } from "@/utils/localStorageDB";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Appointment = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userAppointments, setUserAppointments] = useState<AppointmentType[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const checkAppointments = () => {
    if (!userEmail) return;
    
    setIsChecking(true);
    try {
      const appointments = getAppointments().filter(
        apt => apt.email.toLowerCase() === userEmail.toLowerCase()
      );
      setUserAppointments(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsChecking(false);
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
            {isAuthenticated ? (
              <AppointmentForm />
            ) : (
              <div className="card-glass p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-pet-blue-dark/10 rounded-full flex items-center justify-center mb-2">
                    <LogIn className="h-8 w-8 text-pet-blue-dark" />
                  </div>
                  <h2 className="text-2xl font-bold">Login Required</h2>
                  <p className="text-muted-foreground max-w-md">
                    You need to be logged in to book an appointment for your pet. 
                    Please log in to your account to continue.
                  </p>
                  <div className="flex gap-4 mt-4">
                    <Link 
                      to="/login" 
                      className="px-5 py-2 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors"
                    >
                      Log in
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Check Existing Appointments */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-medium mb-4">Check Your Appointments</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your email to check the status of your existing appointments.
                </p>
                
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                    />
                  </div>
                  <button
                    onClick={checkAppointments}
                    disabled={isChecking || !userEmail}
                    className="px-4 py-2 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors disabled:opacity-50"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                
                {userAppointments.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <h4 className="text-sm font-medium">Your Appointments</h4>
                    {userAppointments.map((apt) => (
                      <div key={apt.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{apt.petName} - {apt.service}</p>
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
                  </div>
                )}
                
                {userEmail && userAppointments.length === 0 && !isChecking && (
                  <p className="text-sm text-muted-foreground">No appointments found for this email.</p>
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
