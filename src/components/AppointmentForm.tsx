import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, PawPrint, Stethoscope } from "lucide-react";
import { saveAppointment } from "@/utils/localStorageDB";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import { AppointmentSuccessDialog } from "@/components/AppointmentSuccessDialog";
import { AppointmentConfirmDialog } from "@/components/AppointmentConfirmDialog";

const formSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  petSpecies: z.string().min(1, "Pet species is required"),
  reptileType: z.string().optional(),
  reptileTypeOther: z.string().optional(),
  otherSpecies: z.string().optional(),
  breed: z.string().optional(),
  breedOther: z.string().optional(),
  weight: z.string().optional(),
  ownerName: z.string().min(1, "Owner name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
  diagnosis: z.string().min(1, "Please describe the reason for the visit"),
  bloodTest: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AppointmentForm() {
  const { toast } = useToast();
  const { user, getUserPets } = useAuth();
  const { showNotification } = useNotification();
  const [userPets, setUserPets] = useState<any[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [showReptileType, setShowReptileType] = useState(false);
  const [showReptileTypeOther, setShowReptileTypeOther] = useState(false);
  const [showOtherSpecies, setShowOtherSpecies] = useState(false);
  const [showBreed, setShowBreed] = useState(false);
  const [showBreedOther, setShowBreedOther] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [pendingAppointmentData, setPendingAppointmentData] = useState<any>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petName: "",
      petSpecies: "",
      reptileType: "",
      reptileTypeOther: "",
      otherSpecies: "",
      breed: "",
      breedOther: "",
      weight: "",
      ownerName: user?.name || "",
      email: user?.email || "",
      phone: "",
      service: "",
      date: "",
      timeSlot: "",
      diagnosis: "",
      bloodTest: "",
      additionalInfo: "",
    },
  });

  // Load user's pets on component mount
  React.useEffect(() => {
    if (user) {
      setPetsLoading(true);
      try {
        const pets = getUserPets();
        console.log("Loaded pets:", pets); // Debug log
        setUserPets(pets || []);
      } catch (error) {
        console.error("Error loading user pets:", error);
        setUserPets([]);
      } finally {
        setPetsLoading(false);
      }
    }
  }, [user, getUserPets]);

  const watchedSpecies = form.watch("petSpecies");
  const watchedReptileType = form.watch("reptileType");
  const watchedBreed = form.watch("breed");

  // Show/hide conditional fields based on species selection
  React.useEffect(() => {
    setShowReptileType(watchedSpecies === "reptile");
    setShowOtherSpecies(watchedSpecies === "other");
    setShowBreed(watchedSpecies === "dog" || watchedSpecies === "cat");
    
    // Clear fields when species changes
    if (watchedSpecies !== "reptile") {
      form.setValue("reptileType", "");
      form.setValue("reptileTypeOther", "");
    }
    if (watchedSpecies !== "other") {
      form.setValue("otherSpecies", "");
    }
    if (watchedSpecies !== "dog" && watchedSpecies !== "cat") {
      form.setValue("breed", "");
      form.setValue("breedOther", "");
    }
  }, [watchedSpecies, form]);

  // Show/hide reptile type other field
  React.useEffect(() => {
    setShowReptileTypeOther(watchedReptileType === "other");
    if (watchedReptileType !== "other") {
      form.setValue("reptileTypeOther", "");
    }
  }, [watchedReptileType, form]);

  // Show/hide breed other field
  React.useEffect(() => {
    setShowBreedOther(watchedBreed === "other");
    if (watchedBreed !== "other") {
      form.setValue("breedOther", "");
    }
  }, [watchedBreed, form]);

  // Handle pet selection for autofill
  const handlePetSelect = (petId: string) => {
    if (petId === "none") {
      // Clear selection
      return;
    }
    
    const selectedPet = userPets.find(pet => pet.id === petId);
    console.log("Selected pet:", selectedPet); // Debug log
    
    if (selectedPet) {
      // Fill basic pet info
      form.setValue("petName", selectedPet.name);
      
      // Handle species properly - check if it's a complex species format
      if (selectedPet.species) {
        if (selectedPet.species.startsWith("reptile:")) {
          form.setValue("petSpecies", "reptile");
          const reptileType = selectedPet.species.substring(8);
          form.setValue("reptileType", reptileType);
        } else if (selectedPet.species.startsWith("other:")) {
          form.setValue("petSpecies", "other");
          form.setValue("otherSpecies", selectedPet.species.substring(6));
        } else {
          // Simple species like "dog", "cat", etc.
          form.setValue("petSpecies", selectedPet.species);
        }
      } else {
        // Fallback to the type field if species is not available
        form.setValue("petSpecies", selectedPet.type);
      }
      
      // Fill breed if available
      if (selectedPet.breed) {
        form.setValue("breed", selectedPet.breed);
      }
      
      // Fill weight if available
      if (selectedPet.weight) {
        form.setValue("weight", selectedPet.weight);
      }
      
      toast({
        title: "Pet information filled",
        description: `Information for ${selectedPet.name} has been added to the form.`,
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      let finalSpecies = data.petSpecies;
      
      if (data.petSpecies === "reptile" && data.reptileType) {
        if (data.reptileType === "other" && data.reptileTypeOther) {
          finalSpecies = `reptile:${data.reptileTypeOther}`;
        } else {
          finalSpecies = `reptile:${data.reptileType}`;
        }
      } else if (data.petSpecies === "other" && data.otherSpecies) {
        finalSpecies = `other:${data.otherSpecies}`;
      }

      let finalBreed = data.breed;
      if (data.breed === "other" && data.breedOther) {
        finalBreed = data.breedOther;
      }

      const appointmentData = {
        petName: data.petName,
        petSpecies: finalSpecies,
        breed: finalBreed || "",
        weight: data.weight || "",
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        service: data.service,
        date: data.date,
        timeSlot: data.timeSlot,
        diagnosis: data.diagnosis,
        bloodTest: data.bloodTest || "",
        additionalInfo: data.additionalInfo || "",
        petAge: "",
        petGender: "",
        status: "Pending" as const,
      };

      // Set pending data and show confirmation dialog
      setPendingAppointmentData(appointmentData);
      setShowConfirmDialog(true);
    } catch (error) {
      console.error("Error preparing appointment:", error);
      toast({
        title: "Error",
        description: "Failed to prepare appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAppointment = async () => {
    if (!pendingAppointmentData) return;

    try {
      const savedAppointment = await saveAppointment(pendingAppointmentData);
      
      // Set appointment details for the success dialog
      setAppointmentDetails({
        petName: pendingAppointmentData.petName,
        petSpecies: pendingAppointmentData.petSpecies,
        ownerName: pendingAppointmentData.ownerName,
        email: pendingAppointmentData.email,
        phone: pendingAppointmentData.phone,
        service: pendingAppointmentData.service,
        date: pendingAppointmentData.date,
        timeSlot: pendingAppointmentData.timeSlot,
        diagnosis: pendingAppointmentData.diagnosis,
      });
      
      // Show notification with appointment details
      showNotification({
        petName: pendingAppointmentData.petName,
        service: pendingAppointmentData.service,
        date: pendingAppointmentData.date,
        timeSlot: pendingAppointmentData.timeSlot,
        ownerName: pendingAppointmentData.ownerName,
      });
      
      // Close confirmation dialog and show success dialog
      setShowConfirmDialog(false);
      setShowSuccessDialog(true);
      
      form.reset();
      setPendingAppointmentData(null);
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditAppointment = () => {
    setShowConfirmDialog(false);
    // User can continue editing the form
  };

  const handleBookAgain = () => {
    setShowSuccessDialog(false);
    // Form is already reset, so user can book again
  };

  const handleChangeSchedule = () => {
    setShowSuccessDialog(false);
    // Pre-fill the form with the last appointment data (except date and time)
    if (appointmentDetails) {
      form.setValue("petName", appointmentDetails.petName);
      form.setValue("ownerName", appointmentDetails.ownerName);
      form.setValue("email", appointmentDetails.email);
      form.setValue("phone", appointmentDetails.phone);
      form.setValue("service", appointmentDetails.service);
      form.setValue("diagnosis", appointmentDetails.diagnosis);
      
      // Handle species properly
      if (appointmentDetails.petSpecies.startsWith("reptile:")) {
        form.setValue("petSpecies", "reptile");
        const reptileType = appointmentDetails.petSpecies.substring(8);
        form.setValue("reptileType", reptileType);
      } else if (appointmentDetails.petSpecies.startsWith("other:")) {
        form.setValue("petSpecies", "other");
        form.setValue("otherSpecies", appointmentDetails.petSpecies.substring(6));
      } else {
        form.setValue("petSpecies", appointmentDetails.petSpecies);
      }
      
      // Clear date and time to force user to select new ones
      form.setValue("date", "");
      form.setValue("timeSlot", "");
    }
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const dogBreeds = [
    "Golden Retriever", "Labrador Retriever", "German Shepherd", "Bulldog", 
    "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund", 
    "Siberian Husky", "Boxer", "Border Collie", "Chihuahua", "Shih Tzu", "Mixed Breed", "Other"
  ];

  const catBreeds = [
    "Persian", "Maine Coon", "Siamese", "Ragdoll", "British Shorthair", 
    "Abyssinian", "Birman", "Oriental Shorthair", "American Shorthair", 
    "Scottish Fold", "Sphynx", "Russian Blue", "Mixed Breed", "Other"
  ];

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-pet-blue-dark" />
            Book an Appointment
          </CardTitle>
          <CardDescription>
            Fill out the form below to schedule a visit for your pet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Pet Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <PawPrint size={18} />
                  Pet Information
                </h3>
                
                {/* Pet Selection for Autofill - Always show this section */}
                <div className="p-4 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <FormLabel className="text-sm font-medium mb-2 block">
                    Quick Fill from Your Pets
                  </FormLabel>
                  
                  {petsLoading ? (
                    <div className="text-sm text-muted-foreground">Loading your pets...</div>
                  ) : userPets.length > 0 ? (
                    <>
                      <Select onValueChange={handlePetSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose one of your registered pets to autofill" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Manual entry (clear selection)</SelectItem>
                          {userPets.map((pet) => (
                            <SelectItem key={pet.id} value={pet.id}>
                              {pet.name} ({pet.species || pet.type}
                              {pet.breed && `, ${pet.breed}`}
                              {pet.weight && `, ${pet.weight}`})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="mt-1">
                        You have {userPets.length} registered pet{userPets.length !== 1 ? 's' : ''}. Select one to automatically fill the form below with their details.
                      </FormDescription>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      You don't have any registered pets yet. You can{" "}
                      <a href="/user-pets" className="text-pet-blue-dark hover:underline">
                        register your pets here
                      </a>{" "}
                      for easier booking next time.
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="petName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your pet's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="petSpecies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Species</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select species" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dog">Dog</SelectItem>
                            <SelectItem value="cat">Cat</SelectItem>
                            <SelectItem value="bird">Bird</SelectItem>
                            <SelectItem value="rabbit">Rabbit</SelectItem>
                            <SelectItem value="hamster">Hamster</SelectItem>
                            <SelectItem value="fish">Fish</SelectItem>
                            <SelectItem value="reptile">Reptile</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Reptile Type Selection */}
                {showReptileType && (
                  <FormField
                    control={form.control}
                    name="reptileType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Reptile</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reptile type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="snake">Snake</SelectItem>
                            <SelectItem value="lizard">Lizard</SelectItem>
                            <SelectItem value="turtle">Turtle</SelectItem>
                            <SelectItem value="gecko">Gecko</SelectItem>
                            <SelectItem value="iguana">Iguana</SelectItem>
                            <SelectItem value="bearded-dragon">Bearded Dragon</SelectItem>
                            <SelectItem value="chameleon">Chameleon</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Reptile Type Other Comment Box */}
                {showReptileTypeOther && (
                  <FormField
                    control={form.control}
                    name="reptileTypeOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify the type of reptile</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Monitor Lizard, Corn Snake, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Other Species Comment Box */}
                {showOtherSpecies && (
                  <FormField
                    control={form.control}
                    name="otherSpecies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify the type of pet</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Ferret, Guinea Pig, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Breed Selection for Dogs and Cats */}
                {showBreed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select breed" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(watchedSpecies === "dog" ? dogBreeds : catBreeds).map((breed) => (
                                <SelectItem key={breed} value={breed.toLowerCase().replace(/ /g, "-")}>
                                  {breed}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select weight range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="small">Small (5-10 kg)</SelectItem>
                              <SelectItem value="medium">Medium (10-25 kg)</SelectItem>
                              <SelectItem value="large">Large (25-45 kg)</SelectItem>
                              <SelectItem value="extra-large">Extra Large (45+ kg)</SelectItem>
                              <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the approximate weight range of your pet
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Breed Other Comment Box */}
                {showBreedOther && (
                  <FormField
                    control={form.control}
                    name="breedOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify the breed</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the specific breed name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Pet Diagnosis/Reason for Visit */}
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Stethoscope size={16} />
                        Reason for Visit / Pet Diagnosis
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason for visit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="illness">Pet is Sick</SelectItem>
                          <SelectItem value="injury">Injury/Accident</SelectItem>
                          <SelectItem value="grooming">Grooming</SelectItem>
                          <SelectItem value="dental">Dental Care</SelectItem>
                          <SelectItem value="behavioral">Behavioral Issues</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Please select the main reason for bringing your pet to the clinic
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Blood Test Selection */}
                <FormField
                  control={form.control}
                  name="bloodTest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Chemistry Test (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood test type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No blood test needed</SelectItem>
                          <SelectItem value="basic">Basic Blood Chemistry - ₱1,200</SelectItem>
                          <SelectItem value="complete">Complete Blood Chemistry - ₱2,500</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Blood tests help assess your pet's overall health and organ function
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Owner Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Owner Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Appointment Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <CalendarDays size={18} />
                  Appointment Details
                </h3>
                
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="General Consultation">General Consultation - ₱1,500</SelectItem>
                          <SelectItem value="Vaccination">Vaccination - ₱800</SelectItem>
                          <SelectItem value="Grooming">Pet Grooming - ₱2,000</SelectItem>
                          <SelectItem value="Dental Care">Dental Care - ₱2,500</SelectItem>
                          <SelectItem value="Surgery">Surgery - ₱8,000</SelectItem>
                          <SelectItem value="Emergency Care">Emergency Care - ₱3,000</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock size={16} />
                          Preferred Time
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional information about your pet's condition or special requirements..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Provide any additional details that might help us prepare for your visit
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full bg-pet-blue-dark hover:bg-pet-blue-dark/90">
                Review Appointment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AppointmentConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        appointmentData={pendingAppointmentData}
        onConfirm={handleConfirmAppointment}
        onEdit={handleEditAppointment}
      />

      <AppointmentSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        appointmentDetails={appointmentDetails}
        onBookAgain={handleBookAgain}
        onChangeSchedule={handleChangeSchedule}
      />
    </>
  );
}
