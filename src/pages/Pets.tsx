
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Edit, Trash, PawPrint } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define form schema
const petFormSchema = z.object({
  name: z.string().min(1, { message: "Pet name is required" }),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
  birthDate: z.string().optional(),
  type: z.enum(["dog", "cat", "bird", "other"], {
    required_error: "Please select a pet type",
  }),
});

type PetFormValues = z.infer<typeof petFormSchema>;

const Pets = () => {
  const { user, addPet, updatePet } = useAuth();
  const { toast } = useToast();
  const [petDialogOpen, setPetDialogOpen] = useState(false);
  const [editingPetIndex, setEditingPetIndex] = useState<number | null>(null);
  const pets = user?.userInfo.pets || [];

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      gender: "male",
      birthDate: "",
      type: "dog",
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center p-12">
            <h1 className="text-2xl font-semibold mb-4">Please log in to view your pets</h1>
          </div>
        </div>
      </div>
    );
  }

  const openNewPetDialog = () => {
    form.reset();
    setEditingPetIndex(null);
    setPetDialogOpen(true);
  };

  const openEditPetDialog = (index: number) => {
    const pet = pets[index];
    form.reset({
      name: pet.name,
      gender: pet.gender,
      birthDate: pet.birthDate || "",
      type: pet.type,
    });
    setEditingPetIndex(index);
    setPetDialogOpen(true);
  };

  const onSubmit = (data: PetFormValues) => {
    if (editingPetIndex !== null) {
      updatePet(editingPetIndex, data);
      toast({
        title: "Pet updated",
        description: `${data.name}'s information has been updated.`,
      });
    } else {
      addPet(data);
      toast({
        title: "Pet added",
        description: `${data.name} has been added to your pets.`,
      });
    }
    setPetDialogOpen(false);
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "Unknown";
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    if (years === 0) {
      const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
  };

  const getPetTypeIcon = (type: string) => {
    switch (type) {
      case "dog":
        return "🐕";
      case "cat":
        return "🐈";
      case "bird":
        return "🦜";
      default:
        return "🐾";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Pets</h1>
          <Button onClick={openNewPetDialog} className="bg-pet-blue-dark hover:bg-pet-blue-dark/90">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Pet
          </Button>
        </div>

        {pets.length === 0 ? (
          <Alert className="bg-pet-gray dark:bg-gray-800">
            <AlertDescription>
              You haven't added any pets yet. Click the "Add Pet" button to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pets.map((pet, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-pet-blue/20 flex items-center justify-center text-lg">
                        {getPetTypeIcon(pet.type)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{pet.name}</CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">{pet.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openEditPetDialog(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-sm text-muted-foreground">Gender:</div>
                    <div className="text-sm capitalize">{pet.gender}</div>
                    
                    <div className="text-sm text-muted-foreground">Age:</div>
                    <div className="text-sm">
                      {pet.birthDate ? calculateAge(pet.birthDate) : "Unknown"}
                    </div>
                    
                    {pet.birthDate && (
                      <>
                        <div className="text-sm text-muted-foreground">Birth Date:</div>
                        <div className="text-sm">
                          {new Date(pet.birthDate).toLocaleDateString()}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={petDialogOpen} onOpenChange={setPetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPetIndex !== null ? "Edit Pet" : "Add New Pet"}</DialogTitle>
              <DialogDescription>
                {editingPetIndex !== null
                  ? "Update your pet's information."
                  : "Enter your pet's details below."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Buddy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pet type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-pet-blue-dark hover:bg-pet-blue-dark/90"
                  >
                    {editingPetIndex !== null ? "Update Pet" : "Add Pet"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Pets;
