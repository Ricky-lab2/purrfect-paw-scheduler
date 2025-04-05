
import { useState } from "react";
import { Check, Calendar, Clock, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ServiceType = "checkup" | "vaccination" | "grooming" | "surgery" | "deworming";
type TimeSlot = "morning" | "afternoon" | "evening";
type PetGender = "male" | "female";

export function AppointmentForm() {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: "",
    petName: "",
    petAge: "",
    petGender: "" as PetGender,
    email: "",
    phone: "",
    serviceType: "" as ServiceType,
    date: "",
    timeSlot: "" as TimeSlot,
    isUrgent: false,
    isFirstTime: false,
    additionalInfo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.petName || !formData.email || !formData.phone || !formData.petAge || !formData.petGender) {
        toast({
          title: "Missing information",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.serviceType) {
        toast({
          title: "Missing information",
          description: "Please select a service type",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.timeSlot) {
      toast({
        title: "Missing information",
        description: "Please select a date and time slot",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally send the data to your backend
    console.log("Form submitted:", formData);
    
    toast({
      title: "Appointment Scheduled",
      description: "We'll send you a confirmation email shortly",
    });
    
    // Reset form
    setFormData({
      name: "",
      petName: "",
      petAge: "",
      petGender: "" as PetGender,
      email: "",
      phone: "",
      serviceType: "" as ServiceType,
      date: "",
      timeSlot: "" as TimeSlot,
      isUrgent: false,
      isFirstTime: false,
      additionalInfo: "",
    });
    setStep(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-pet-blue-dark text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {step > 1 ? <Check size={16} /> : 1}
            </div>
            <div className={`h-1 w-16 mx-2 ${
              step > 1 ? "bg-pet-blue-dark" : "bg-gray-200"
            }`}></div>
          </div>
          
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-pet-blue-dark text-white" : "bg-gray-200 text-gray-500"
            }`}>
              {step > 2 ? <Check size={16} /> : 2}
            </div>
            <div className={`h-1 w-16 mx-2 ${
              step > 2 ? "bg-pet-blue-dark" : "bg-gray-200"
            }`}></div>
          </div>
          
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-pet-blue-dark text-white" : "bg-gray-200 text-gray-500"
            }`}>
              3
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-sm">
          <span className={step >= 1 ? "text-pet-blue-dark font-medium" : "text-gray-500"}>
            Personal Info
          </span>
          <span className={step >= 2 ? "text-pet-blue-dark font-medium" : "text-gray-500"}>
            Service Selection
          </span>
          <span className={step >= 3 ? "text-pet-blue-dark font-medium" : "text-gray-500"}>
            Schedule
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-glass p-6">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-medium mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Name*
                </label>
                <input
                  type="text"
                  id="petName"
                  name="petName"
                  value={formData.petName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="petAge" className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Age*
                </label>
                <input
                  type="text"
                  id="petAge"
                  name="petAge"
                  value={formData.petAge}
                  onChange={handleChange}
                  placeholder="e.g., 2 years"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="petGender" className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Gender*
                </label>
                <select
                  id="petGender"
                  name="petGender"
                  value={formData.petGender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Service Selection */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-medium mb-4">Select Service</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["checkup", "vaccination", "grooming", "surgery", "deworming"].map((service) => (
                <div key={service}>
                  <input
                    type="radio"
                    id={service}
                    name="serviceType"
                    value={service}
                    checked={formData.serviceType === service}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor={service}
                    className={`block border rounded-xl p-4 cursor-pointer transition-all ${
                      formData.serviceType === service 
                        ? "border-pet-blue-dark bg-pet-blue/10 ring-2 ring-pet-blue" 
                        : "border-gray-200 hover:border-pet-blue"
                    }`}
                  >
                    <span className="block text-center capitalize font-medium">
                      {service}
                    </span>
                  </label>
                </div>
              ))}
            </div>
            
            {formData.serviceType === "checkup" && (
              <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                <h3 className="font-medium mb-2">Checkup Information</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Regular checkups help detect health issues early and ensure your pet stays healthy.
                </p>
                
                <div className="flex items-start gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    name="isUrgent"
                    checked={formData.isUrgent}
                    onChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <label htmlFor="isUrgent" className="text-sm">
                    This is an urgent matter that requires immediate attention
                  </label>
                </div>
                
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information (symptoms, concerns, etc.)
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            )}
            
            {formData.serviceType === "vaccination" && (
              <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                <h3 className="font-medium mb-2">Vaccination Information</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Regular vaccinations are essential for protecting your pet against common diseases.
                </p>
                
                <div className="flex items-start gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="isFirstTime"
                    name="isFirstTime"
                    checked={formData.isFirstTime}
                    onChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <label htmlFor="isFirstTime" className="text-sm">
                    This is my pet's first time getting vaccinated
                  </label>
                </div>
                
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2">
                    <Check size={16} className="text-pet-blue-dark shrink-0 mt-0.5" />
                    <span>Core vaccines (required for all pets)</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-pet-blue-dark shrink-0 mt-0.5" />
                    <span>Non-core vaccines (based on lifestyle and risk)</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-pet-blue-dark shrink-0 mt-0.5" />
                    <span>Vaccination records and reminders</span>
                  </li>
                </ul>
              </div>
            )}
            
            {formData.serviceType === "surgery" && (
              <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                <h3 className="font-medium mb-2">Surgery Information</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our veterinary surgeons provide a range of surgical services with state-of-the-art equipment.
                </p>
                
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information (prior conditions, medications, etc.)
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                    rows={3}
                    placeholder="Please provide any relevant information about your pet's condition..."
                  ></textarea>
                </div>
              </div>
            )}
            
            {formData.serviceType === "deworming" && (
              <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                <h3 className="font-medium mb-2">Deworming Information</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Regular deworming helps protect your pet from internal parasites.
                </p>
                
                <div className="flex items-start gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="isFirstTime"
                    name="isFirstTime"
                    checked={formData.isFirstTime}
                    onChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <label htmlFor="isFirstTime" className="text-sm">
                    This is my pet's first time getting dewormed
                  </label>
                </div>
                
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                    rows={3}
                    placeholder="Please provide any relevant information about your pet..."
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-medium mb-4">Schedule Appointment</h2>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Select Date*
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Time Slot*
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["morning", "afternoon", "evening"].map((slot) => (
                  <div key={slot}>
                    <input
                      type="radio"
                      id={slot}
                      name="timeSlot"
                      value={slot}
                      checked={formData.timeSlot === slot}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={slot}
                      className={`flex items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer transition-all ${
                        formData.timeSlot === slot 
                          ? "border-pet-blue-dark bg-pet-blue/10 ring-2 ring-pet-blue" 
                          : "border-gray-200 hover:border-pet-blue"
                      }`}
                    >
                      <Clock size={16} />
                      <span className="capitalize">{slot}</span>
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <span className="font-medium">Morning:</span> 8:00 AM - 12:00 PM | 
                <span className="font-medium"> Afternoon:</span> 12:00 PM - 4:00 PM | 
                <span className="font-medium"> Evening:</span> 4:00 PM - 8:00 PM
              </p>
            </div>
            
            <div className="bg-pet-gray rounded-lg p-4">
              <h3 className="font-medium mb-2">Appointment Summary</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-500">Service:</div>
                <div className="font-medium capitalize">{formData.serviceType}</div>
                
                <div className="text-gray-500">Pet Name:</div>
                <div className="font-medium">{formData.petName}</div>
                
                <div className="text-gray-500">Pet Age:</div>
                <div className="font-medium">{formData.petAge}</div>
                
                <div className="text-gray-500">Pet Gender:</div>
                <div className="font-medium capitalize">{formData.petGender}</div>
                
                {formData.date && (
                  <>
                    <div className="text-gray-500">Date:</div>
                    <div className="font-medium">{new Date(formData.date).toLocaleDateString()}</div>
                  </>
                )}
                
                {formData.timeSlot && (
                  <>
                    <div className="text-gray-500">Time:</div>
                    <div className="font-medium capitalize">{formData.timeSlot}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-5 py-2 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors flex items-center gap-2"
            >
              Continue <ChevronDown className="rotate-[270deg]" size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className="px-5 py-2 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors"
            >
              Schedule Appointment
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
