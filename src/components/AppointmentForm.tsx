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

const formSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  petSpecies: z.string().min(1, "Pet species is required"),
  reptileType: z.string().optional(),
  ownerName: z.string().min(1, "Owner name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
  diagnosis: z.string().min(1, "Please describe the reason for the visit"),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AppointmentForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showReptileType, setShowReptileType] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petName: "",
      petSpecies: "",
      reptileType: "",
      ownerName: user?.name || "",
      email: user?.email || "",
      phone: "",
      service: "",
      date: "",
      timeSlot: "",
      diagnosis: "",
      additionalInfo: "",
    },
  });

  const watchedSpecies = form.watch("petSpecies");

  // Show reptile type field when reptile is selected
  React.useEffect(() => {
    setShowReptileType(watchedSpecies === "reptile");
    if (watchedSpecies !== "reptile") {
      form.setValue("reptileType", "");
    }
  }, [watchedSpecies, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const appointmentData = {
        ...data,
        petSpecies: data.petSpecies === "reptile" && data.reptileType 
          ? `reptile:${data.reptileType}` 
          : data.petSpecies,
        petAge: "",
        petGender: "",
        status: "Pending" as const,
      };

      await saveAppointment(appointmentData);
      
      toast({
        title: "Appointment Booked!",
        description: "We'll contact you shortly to confirm your appointment.",
      });

      form.reset();
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  return (
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
              Book Appointment
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
