
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PawPrint, Plus, Pencil, Trash2, Heart } from "lucide-react";

type Pet = {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird" | "other";
  breed?: string;
  birthDate: string;
  gender: "male" | "female";
  ownerId: string;
};

type PetFormData = Omit<Pet, 'id' | 'ownerId'>;

const DEFAULT_PET_FORM: PetFormData = {
  name: "",
  type: "dog",
  breed: "",
  birthDate: "",
  gender: "male"
};

const UserPets = () => {
  const { getUserPets, addPet, updatePet, deletePet } = useAuth();
  const { toast } = useToast();
  
  const [pets, setPets] = useState<Pet[]>(getUserPets());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState<PetFormData>(DEFAULT_PET_FORM);
  
  const refreshPets = () => {
    setPets(getUserPets());
  };
  
  const handleFormChange = (field: keyof PetFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddPet = () => {
    try {
      addPet(formData);
      refreshPets();
      setIsAddDialogOpen(false);
      setFormData(DEFAULT_PET_FORM);
      
      toast({
        title: "Pet added",
        description: `${formData.name} has been added to your pets.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add pet. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditPet = () => {
    if (!currentPet) return;
    
    const success = updatePet(currentPet.id, formData);
    
    if (success) {
      refreshPets();
      setIsEditDialogOpen(false);
      
      toast({
        title: "Pet updated",
        description: `${formData.name}'s information has been updated.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update pet. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeletePet = (pet: Pet) => {
    if (confirm(`Are you sure you want to remove ${pet.name} from your pets?`)) {
      const success = deletePet(pet.id);
      
      if (success) {
        refreshPets();
        
        toast({
          title: "Pet removed",
          description: `${pet.name} has been removed from your pets.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to remove pet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  const startEditPet = (pet: Pet) => {
    setCurrentPet(pet);
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || "",
      birthDate: pet.birthDate,
      gender: pet.gender
    });
    setIsEditDialogOpen(true);
  };
  
  // Get appropriate icon based on pet type
  const getPetIcon = (type: string) => {
    switch (type) {
      case "dog": return "🐕";
      case "cat": return "🐈";
      case "bird": return "🦜";
      default: return "🐾";
    }
  };
  
  return (
    <div className="container max-w-4xl py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Pets</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Pet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Pet</DialogTitle>
              <DialogDescription>
                Enter your pet's information below
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="Enter pet name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Pet Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleFormChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleFormChange("gender", value as "male" | "female")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="breed">Breed (Optional)</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => handleFormChange("breed", e.target.value)}
                  placeholder="Enter breed"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleFormChange("birthDate", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPet} disabled={!formData.name || !formData.birthDate}>
                Add Pet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-6">
        {pets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <PawPrint className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No pets yet</h3>
              <p className="text-center text-muted-foreground mb-6">
                Add your pets to keep track of their health records and appointments
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Pet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between">
                    <span className="flex items-center">
                      <span className="mr-2 text-xl">{getPetIcon(pet.type)}</span>
                      {pet.name}
                    </span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => startEditPet(pet)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePet(pet)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {pet.breed ? `${pet.type} · ${pet.breed}` : pet.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Birth Date:</span>
                      <span>{new Date(pet.birthDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="capitalize">{pet.gender}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Heart className="h-3 w-3 mr-1 fill-pet-teal stroke-none" />
                    Since {new Date(parseInt(pet.id.split('-')[1])).toLocaleDateString()}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pet</DialogTitle>
            <DialogDescription>
              Update your pet's information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Pet Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Enter pet name"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Pet Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleFormChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleFormChange("gender", value as "male" | "female")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-breed">Breed (Optional)</Label>
              <Input
                id="edit-breed"
                value={formData.breed}
                onChange={(e) => handleFormChange("breed", e.target.value)}
                placeholder="Enter breed"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-birthDate">Birth Date</Label>
              <Input
                id="edit-birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleFormChange("birthDate", e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPet} disabled={!formData.name || !formData.birthDate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserPets;
