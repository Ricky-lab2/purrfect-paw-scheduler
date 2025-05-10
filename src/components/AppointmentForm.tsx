import { useState, useEffect } from "react";
import { Check, Calendar, Clock, ChevronDown, User, PawPrint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAppointment } from "@/utils/localStorageDB";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type ServiceType = "checkup" | "vaccination" | "grooming" | "surgery" | "deworming";
type TimeSlot = "morning" | "afternoon" | "evening";
type PetGender = "male" | "female";
type PetSpecies = "dog" | "cat" | "bird" | "rabbit" | "hamster" | "fish" | "reptile" | "other";

type Pet = {
  id: string;
  name: string;
  type: string;
  breed?: string;
  birthDate: string;
  gender: PetGender;
  ownerId: string;
};

export function AppointmentForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, getUserPets, calculatePetAge } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    petName: "",
    petAge: "",
    petGender: "" as PetGender,
    petSpecies: "" as PetSpecies,
    email: user?.email || "",
    phone: user?.phone || "",
    serviceType: "" as ServiceType,
    date: "",
    timeSlot: "" as TimeSlot,
    isUrgent: false,
    isFirstTime: false,
    additionalInfo: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Set user information from profile
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
      
      // Fetch user's pets
      const pets = getUserPets();
      setUserPets(pets);
    }
  }, [user]);
  
  // Handle pet selection change
  const handlePetChange = (petId: string) => {
    setSelectedPet(petId);
    
    if (petId) {
      const pet = userPets.find(p => p.id === petId);
      if (pet) {
        setFormData(prev => ({
          ...prev,
          petName: pet.name,
          petGender: pet.gender,
          petSpecies: pet.type as PetSpecies,
          petAge: calculatePetAge(pet.birthDate)
        }));
      }
    }
  };

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
      if (!formData.name || !formData.petName || !formData.email || !formData.phone || !formData.petAge || !formData.petGender || !formData.petSpecies) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.timeSlot) {
      toast({
        title: "Missing information",
        description: "Please select a date and time slot",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const appointment = saveAppointment({
        petName: formData.petName,
        ownerName: formData.name,
        petAge: formData.petAge,
        petGender: formData.petGender,
        petSpecies: formData.petSpecies,
        email: formData.email,
        phone: formData.phone,
        service: formData.serviceType,
        date: formData.date,
        timeSlot: formData.timeSlot,
        additionalInfo: formData.additionalInfo,
        isUrgent: formData.isUrgent,
        isFirstTime: formData.isFirstTime
      });
      
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment ID is ${appointment.id}. We'll send you a confirmation email shortly.`,
      });
      
      navigate("/user/appointments");
      
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
  };

  // Service descriptions
  const serviceDescriptions = {
    checkup: "A comprehensive health assessment of your pet including physical examination, weight check, and general health screening.",
    vaccination: "Essential vaccines to protect your pet against common diseases and maintain their health and immunity.",
    grooming: "Complete grooming service including bath, hair trimming, nail cutting, ear cleaning, and more.",
    surgery: "Professional surgical procedures performed by experienced veterinarians in a sterile environment.",
    deworming: "Treatment to eliminate parasitic worms and protect your pet from related health issues."
  };

  // Service prices
  const servicePrices = {
    checkup: "$50 - $80",
    vaccination: "$30 - $100",
    grooming: "$40 - $120",
    surgery: "$200 - $2000+",
    deworming: "$15 - $50"
  };

  // Species icon mapping
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

      <form onSubmit={handleSubmit} className="card-glass p-6">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-medium mb-4">Personal Information</h2>
            
            {userPets.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <PawPrint className="h-5 w-5 text-pet-blue" />
                  <h3 className="font-medium">Select Your Pet</h3>
                </div>
                <div className="mb-2">
                  <Select value={selectedPet} onValueChange={handlePetChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a pet to autofill information" />
                    </SelectTrigger>
                    <SelectContent>
                      {userPets.map(pet => (
                        <SelectItem key={pet.id} value={pet.id} className="flex items-center gap-2">
                          <span className="mr-2 text-xl">{pet.type === "dog" ? "🐕" : pet.type === "cat" ? "🐈" : pet.type === "bird" ? "🦜" : "🐾"}</span>
                          {pet.name} ({pet.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedPet && (
                  <div className="mt-2 p-2 bg-blue-100 rounded text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-600" />
                    Pet information has been automatically filled
                  </div>
                )}
              </div>
            )}
            
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
                  readOnly={!!selectedPet}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  readOnly={!!selectedPet}
                />
                {!selectedPet && (
                  <p className="text-xs text-muted-foreground mt-1">
                    To automatically calculate age, add your pet's birthdate in your profile.
                  </p>
                )}
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
                  disabled={!!selectedPet}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="petSpecies" className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Species*
                </label>
                <select
                  id="petSpecies"
                  name="petSpecies"
                  value={formData.petSpecies}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                  required
                  disabled={!!selectedPet}
                >
                  <option value="">Select Species</option>
                  <option value="dog">Dog 🐕</option>
                  <option value="cat">Cat 🐈</option>
                  <option value="bird">Bird 🦜</option>
                  <option value="rabbit">Rabbit 🐇</option>
                  <option value="hamster">Hamster 🐹</option>
                  <option value="fish">Fish 🐠</option>
                  <option value="reptile">Reptile 🦎</option>
                  <option value="other">Other</option>
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
            
            {formData.serviceType && (
              <div className="p-4 bg-pet-blue/5 rounded-lg border border-pet-blue/20">
                <h3 className="font-medium mb-2 capitalize">{formData.serviceType} Information</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {serviceDescriptions[formData.serviceType as keyof typeof serviceDescriptions]}
                  </p>
                  
                  <div className="flex justify-between bg-white p-3 rounded-md border border-gray-100">
                    <span className="text-sm font-medium">Estimated Price:</span>
                    <span className="text-sm">{servicePrices[formData.serviceType as keyof typeof servicePrices]}</span>
                  </div>
                  
                  {formData.serviceType === "checkup" && (
                    <div className="space-y-3">
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
                    <div className="space-y-3">
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
                      
                      <ul className="text-sm space-y-2 bg-white p-3 rounded-md border border-gray-100">
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
                    <div className="space-y-3">
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
                      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 text-sm">
                        <p className="font-medium text-yellow-800">Important Note:</p>
                        <p className="text-yellow-700">Your pet may need to fast before surgery. Our team will provide specific instructions after booking.</p>
                      </div>
                    </div>
                  )}
                  
                  {formData.serviceType === "grooming" && (
                    <div className="space-y-3">
                      <p className="text-sm">Our grooming services include:</p>
                      <ul className="text-sm space-y-2 bg-white p-3 rounded-md border border-gray-100">
                        <li className="flex gap-2">
                          <Check size={16} className="text-pet-blue-dark shrink-0 mt-0.5" />
                          <span>Bath with premium shampoo</span>
                        </li>
                        <li className="flex gap-2">
                          <Check size={16} className="text-pet-blue-dark shrink-0 mt-0.5" />
                          <span>Hair trimming and styling</span>
                        </li>
                        <li className="flex gap-2">
                          <Check size={16} className="text-pet-blue-dark shrink-0 mt-0.5" />
                          <span>Nail trimming</span>
                        </li>
                        <li className="flex gap-2">
                          <Check size={16} className="text-pet-blue-dark shrink-0 mt-0.5" />
                          <span>Ear cleaning</span>
                        </li>
                        <li className="flex gap-2">
                          <Check size={16} className="text-pet-blue-dark shrink-0 mt-0.5" />
                          <span>Teeth brushing</span>
                        </li>
                      </ul>
                      <div>
                        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                          Special requests or instructions
                        </label>
                        <textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pet-blue"
                          rows={2}
                          placeholder="Any specific grooming needs or preferences..."
                        ></textarea>
                      </div>
                    </div>
                  )}
                  
                  {formData.serviceType === "deworming" && (
                    <div className="space-y-3">
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
                      <div className="bg-white p-3 rounded-md border border-gray-100">
                        <p className="text-sm font-medium">Recommended Schedule:</p>
                        <p className="text-sm text-muted-foreground">Puppies and kittens: Every 2-3 weeks until 12 weeks old, then monthly until 6 months</p>
                        <p className="text-sm text-muted-foreground">Adult pets: Every 3-6 months</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

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
                
                <div className="text-gray-500">Pet Species:</div>
                <div className="font-medium capitalize">
                  {formData.petSpecies && (
                    <span>
                      {getSpeciesIcon(formData.petSpecies)} {formData.petSpecies}
                    </span>
                  )}
                </div>
                
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
    </div>
  );
}
