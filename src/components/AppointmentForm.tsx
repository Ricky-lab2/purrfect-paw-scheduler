
import { useState, useEffect } from "react";
import { Check, Calendar, Clock, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAppointment } from "@/utils/localStorageDB";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointment, ServiceType, TimeSlot, PetGender } from "@/contexts/AppointmentContext";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Grooming packages
const groomingPackages = [
  {
    id: "basic",
    name: "Basic Grooming",
    price: "₱1,500",
    description: "Essential grooming services for your pet",
    services: ["Bath & Shampoo", "Blow Dry", "Brush Out", "Nail Trimming", "Ear Cleaning"]
  },
  {
    id: "premium",
    name: "Premium Grooming",
    price: "₱2,500",
    description: "Complete grooming experience with extra care",
    services: ["All Basic Services", "Haircut/Styling", "Teeth Brushing", "Paw Pad Treatment", "Anal Gland Expression"]
  },
  {
    id: "deluxe",
    name: "Deluxe Spa Package",
    price: "₱3,500",
    description: "Luxury treatment for pampered pets",
    services: ["All Premium Services", "Flea Treatment", "Mud Bath", "Aromatherapy", "Facial Scrub", "Pawdicure"]
  }
];

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).refine(val => /^[A-Za-z\s.'-]+$/.test(val), {
    message: "Name can only contain letters, spaces, and basic punctuation."
  }),
  petName: z.string().min(1, {
    message: "Pet name is required."
  }).refine(val => /^[A-Za-z\s.'-]+$/.test(val), {
    message: "Pet name can only contain letters, spaces, and basic punctuation."
  }),
  petAge: z.string(),
  petBirthDate: z.string().optional(),
  petGender: z.string().min(1, {
    message: "Please select your pet's gender."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  phone: z.string()
    .min(11, { message: "Phone number must be 11 digits." })
    .max(11, { message: "Phone number must be 11 digits." })
    .refine(val => val.startsWith("09"), {
      message: "Phone number must start with 09."
    })
    .refine(val => /^[0-9]+$/.test(val), {
      message: "Phone number can only contain digits."
    }),
  serviceType: z.string().min(1, {
    message: "Please select a service type."
  }),
  date: z.string().min(1, {
    message: "Please select a date."
  }),
  timeSlot: z.string().min(1, {
    message: "Please select a time slot."
  }),
  isUrgent: z.boolean().optional(),
  isFirstTime: z.boolean().optional(),
  additionalInfo: z.string().optional(),
  groomingPackage: z.string().optional(),
});

export function AppointmentForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formData, setFormValue, resetForm } = useAppointment();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form with zod schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name,
      petName: formData.petName,
      petAge: formData.petAge,
      petBirthDate: formData.petBirthDate,
      petGender: formData.petGender,
      email: formData.email,
      phone: formData.phone,
      serviceType: formData.serviceType,
      date: formData.date,
      timeSlot: formData.timeSlot,
      isUrgent: formData.isUrgent,
      isFirstTime: formData.isFirstTime,
      additionalInfo: formData.additionalInfo,
      groomingPackage: formData.groomingPackage,
    },
  });

  // Pre-fill form data if user is logged in
  useEffect(() => {
    if (user && user.userInfo) {
      form.setValue('name', user.userInfo.name || '');
      form.setValue('email', user.userInfo.email || '');
      form.setValue('phone', user.userInfo.phone || '');
      
      if (user.userInfo.pets && user.userInfo.pets.length > 0) {
        const pet = user.userInfo.pets[0];
        form.setValue('petName', pet.name || '');
        form.setValue('petGender', pet.gender || '');
        
        if (pet.birthDate) {
          form.setValue('petBirthDate', pet.birthDate);
          // Calculate pet age
          const birthDate = new Date(pet.birthDate);
          const currentDate = new Date();
          
          let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
          const monthDifference = currentDate.getMonth() - birthDate.getMonth();
          
          if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
            ageYears--;
          }
          
          const ageMonths = (monthDifference < 0 ? 12 + monthDifference : monthDifference);
          
          let ageString = "";
          if (ageYears > 0) {
            ageString = `${ageYears} year${ageYears !== 1 ? 's' : ''}`;
          }
          if (ageMonths > 0 || ageYears === 0) {
            if (ageString) ageString += ", ";
            ageString += `${ageMonths} month${ageMonths !== 1 ? 's' : ''}`;
          }
          
          form.setValue('petAge', ageString);
        }
      }
    }
    
    // Skip to step 3 if serviceType is already selected
    if (formData.serviceType) {
      form.setValue('serviceType', formData.serviceType);
      setStep(3);
    }
  }, [user, formData.serviceType, form]);

  // Update context when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      Object.entries(value).forEach(([key, val]) => {
        if (val !== undefined) {
          setFormValue(key, val);
        }
      });
    });
    
    return () => subscription.unsubscribe();
  }, [form, setFormValue]);

  const nextStep = () => {
    if (step === 1) {
      form.trigger(['name', 'petName', 'email', 'phone', 'petGender']);
      if (form.formState.isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      form.trigger(['serviceType']);
      if (form.formState.isValid && form.getValues('serviceType')) {
        setStep(3);
      }
    }
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      
      const appointment = saveAppointment({
        petName: data.petName,
        ownerName: data.name,
        petAge: data.petAge,
        petGender: data.petGender as PetGender,
        email: data.email,
        phone: data.phone,
        service: data.serviceType as ServiceType,
        date: data.date,
        timeSlot: data.timeSlot as TimeSlot,
        additionalInfo: data.additionalInfo || '',
        isUrgent: data.isUrgent || false,
        isFirstTime: data.isFirstTime || false,
        groomingPackage: data.groomingPackage
      });
      
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment ID is ${appointment.id}. We'll send you a confirmation email shortly.`,
      });
      
      resetForm();
      form.reset();
      setStep(1);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
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

      <Form {...form}>
        <form onSubmit={handleSubmit} className="card-glass p-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-medium mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="petName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="petBirthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Birth Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} onChange={(e) => {
                          field.onChange(e);
                          
                          // Calculate age
                          const birthDate = new Date(e.target.value);
                          const currentDate = new Date();
                          
                          let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
                          const monthDifference = currentDate.getMonth() - birthDate.getMonth();
                          
                          if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
                            ageYears--;
                          }
                          
                          const ageMonths = (monthDifference < 0 ? 12 + monthDifference : monthDifference);
                          
                          let ageString = "";
                          if (ageYears > 0) {
                            ageString = `${ageYears} year${ageYears !== 1 ? 's' : ''}`;
                          }
                          if (ageMonths > 0 || ageYears === 0) {
                            if (ageString) ageString += ", ";
                            ageString += `${ageMonths} month${ageMonths !== 1 ? 's' : ''}`;
                          }
                          
                          form.setValue("petAge", ageString);
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="petAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Age*</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!!form.getValues("petBirthDate")} placeholder="e.g., 2 years" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="petGender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Gender*</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number* (11 digits starting with 09)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        maxLength={11}
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-medium mb-4">Select Service</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["checkup", "vaccination", "grooming", "surgery", "deworming"].map((service) => (
                  <div key={service}>
                    <input
                      type="radio"
                      id={service}
                      value={service}
                      checked={form.getValues("serviceType") === service}
                      onChange={() => form.setValue("serviceType", service)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={service}
                      className={`block border rounded-xl p-4 cursor-pointer transition-all ${
                        form.getValues("serviceType") === service 
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
              
              {form.getValues("serviceType") === "checkup" && (
                <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                  <h3 className="font-medium mb-2">Checkup Information</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Regular checkups help detect health issues early and ensure your pet stays healthy.
                  </p>
                  
                  <div className="flex items-start gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="isUrgent"
                      checked={form.getValues("isUrgent")}
                      onChange={(e) => form.setValue("isUrgent", e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="isUrgent" className="text-sm">
                      This is an urgent matter that requires immediate attention
                    </label>
                  </div>
                  
                  <div>
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (symptoms, concerns, etc.)</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                              rows={3}
                            ></textarea>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              {form.getValues("serviceType") === "vaccination" && (
                <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                  <h3 className="font-medium mb-2">Vaccination Information</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Regular vaccinations are essential for protecting your pet against common diseases.
                  </p>
                  
                  <div className="flex items-start gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="isFirstTime"
                      checked={form.getValues("isFirstTime")}
                      onChange={(e) => form.setValue("isFirstTime", e.target.checked)}
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
              
              {form.getValues("serviceType") === "grooming" && (
                <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                  <h3 className="font-medium mb-2">Grooming Packages</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Select the grooming package that best suits your pet's needs.
                  </p>
                  
                  <div className="space-y-4 mt-3">
                    {groomingPackages.map((pkg) => (
                      <div key={pkg.id} className="border rounded-lg overflow-hidden">
                        <input
                          type="radio"
                          id={`package-${pkg.id}`}
                          name="groomingPackage"
                          value={pkg.id}
                          checked={form.getValues("groomingPackage") === pkg.id}
                          onChange={() => form.setValue("groomingPackage", pkg.id)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`package-${pkg.id}`}
                          className={`block cursor-pointer transition-all ${
                            form.getValues("groomingPackage") === pkg.id 
                              ? "border-2 border-pet-blue-dark bg-pet-blue/5" 
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-center p-4 border-b">
                            <div>
                              <h4 className="font-medium">{pkg.name}</h4>
                              <p className="text-sm text-muted-foreground">{pkg.description}</p>
                            </div>
                            <div className="text-pet-blue-dark font-bold">{pkg.price}</div>
                          </div>
                          <div className="p-4">
                            <h5 className="text-sm font-medium mb-2">Includes:</h5>
                            <ul className="grid grid-cols-2 gap-2">
                              {pkg.services.map((service, idx) => (
                                <li key={idx} className="flex text-sm items-start gap-2">
                                  <Check size={14} className="text-pet-blue-dark shrink-0 mt-0.5" />
                                  <span>{service}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {form.getValues("serviceType") === "surgery" && (
                <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                  <h3 className="font-medium mb-2">Surgery Information</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Our veterinary surgeons provide a range of surgical services with state-of-the-art equipment.
                  </p>
                  
                  <div>
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (prior conditions, medications, etc.)</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                              rows={3}
                              placeholder="Please provide any relevant information about your pet's condition..."
                            ></textarea>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              {form.getValues("serviceType") === "deworming" && (
                <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                  <h3 className="font-medium mb-2">Deworming Information</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Regular deworming helps protect your pet from internal parasites.
                  </p>
                  
                  <div className="flex items-start gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="isFirstTime"
                      checked={form.getValues("isFirstTime")}
                      onChange={(e) => form.setValue("isFirstTime", e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="isFirstTime" className="text-sm">
                      This is my pet's first time getting dewormed
                    </label>
                  </div>
                  
                  <div>
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                              rows={3}
                              placeholder="Please provide any relevant information about your pet..."
                            ></textarea>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-medium mb-4">Schedule Appointment</h2>
              
              {/* Show selected service as highlighted */}
              <div className="bg-pet-blue/5 p-4 rounded-lg border border-pet-blue/20 mb-6">
                <h3 className="font-medium mb-2">Selected Service</h3>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-pet-blue-dark text-white rounded-full text-sm capitalize">
                    {form.getValues("serviceType")}
                  </div>
                  
                  {form.getValues("serviceType") === "grooming" && form.getValues("groomingPackage") && (
                    <div className="px-3 py-1 bg-pet-teal-dark text-white rounded-full text-sm">
                      {groomingPackages.find(p => p.id === form.getValues("groomingPackage"))?.name || ""}
                    </div>
                  )}
                  
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="text-xs text-pet-blue-dark hover:underline ml-auto"
                  >
                    Change
                  </button>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Date*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="date"
                          {...field}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormField
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Time Slot*</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {["morning", "afternoon", "evening"].map((slot) => (
                          <div key={slot}>
                            <input
                              type="radio"
                              id={slot}
                              value={slot}
                              checked={field.value === slot}
                              onChange={() => field.onChange(slot)}
                              className="sr-only"
                            />
                            <label
                              htmlFor={slot}
                              className={`flex items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer transition-all ${
                                field.value === slot 
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
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-2">
                        <span className="font-medium">Morning:</span> 8:00 AM - 12:00 PM | 
                        <span className="font-medium"> Afternoon:</span> 12:00 PM - 4:00 PM | 
                        <span className="font-medium"> Evening:</span> 4:00 PM - 8:00 PM
                      </p>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="bg-pet-gray rounded-lg p-4">
                <h3 className="font-medium mb-2">Appointment Summary</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-500">Service:</div>
                  <div className="font-medium capitalize">{form.getValues("serviceType")}</div>
                  
                  {form.getValues("serviceType") === "grooming" && form.getValues("groomingPackage") && (
                    <>
                      <div className="text-gray-500">Package:</div>
                      <div className="font-medium">{groomingPackages.find(p => p.id === form.getValues("groomingPackage"))?.name}</div>
                    </>
                  )}
                  
                  <div className="text-gray-500">Pet Name:</div>
                  <div className="font-medium">{form.getValues("petName")}</div>
                  
                  <div className="text-gray-500">Pet Age:</div>
                  <div className="font-medium">{form.getValues("petAge")}</div>
                  
                  <div className="text-gray-500">Pet Gender:</div>
                  <div className="font-medium capitalize">{form.getValues("petGender")}</div>
                  
                  {form.getValues("date") && (
                    <>
                      <div className="text-gray-500">Date:</div>
                      <div className="font-medium">{new Date(form.getValues("date")).toLocaleDateString()}</div>
                    </>
                  )}
                  
                  {form.getValues("timeSlot") && (
                    <>
                      <div className="text-gray-500">Time:</div>
                      <div className="font-medium capitalize">{form.getValues("timeSlot")}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

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
                disabled={isSubmitting}
                className="px-5 py-2 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
              </button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
