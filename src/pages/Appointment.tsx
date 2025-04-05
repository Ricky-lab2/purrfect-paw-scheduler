
import { AppointmentForm } from "@/components/AppointmentForm";
import { CheckCircle2 } from "lucide-react";

const Appointment = () => {
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
