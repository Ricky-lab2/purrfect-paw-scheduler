
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type PetFormData = {
  name: string;
  type: "dog" | "cat" | "bird" | "rabbit" | "hamster" | "fish" | "reptile" | "other";
  species: string;
  breed?: string;
  weight?: string;
  birthDate: string;
  gender: "male" | "female";
};

export const DEFAULT_PET_FORM: PetFormData = {
  name: "",
  type: "dog",
  species: "dog",
  breed: "",
  weight: "",
  birthDate: "",
  gender: "male"
};

interface AddPetDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onPetAdded: () => void;
}

const AddPetDialog = ({ isOpen, setIsOpen, onPetAdded }: AddPetDialogProps) => {
  const { addPet, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PetFormData>(DEFAULT_PET_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFormChange = (field: keyof PetFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-update species when type changes for simple types
      if (field === "type" && ["dog", "cat", "bird", "fish", "hamster", "rabbit"].includes(value)) {
        updated.species = value;
      }
      return updated;
    });
  };
  
  const handleAddPet = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Pet name required",
        description: "Please enter your pet's name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.birthDate) {
      toast({
        title: "Birth date required",
        description: "Please enter your pet's birth date.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Adding pet with data:", formData);
      
      await addPet(formData);
      
      console.log("Pet added successfully");
      setIsOpen(false);
      setFormData(DEFAULT_PET_FORM);
      onPetAdded();
      
      toast({
        title: "Pet added",
        description: `${formData.name} has been added to your pets.`,
      });
    } catch (error) {
      console.error("Error adding pet:", error);
      toast({
        title: "Error",
        description: "Failed to add pet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Pet</DialogTitle>
          <DialogDescription>
            Enter your pet's information below
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pet Name*</Label>
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
              <Label htmlFor="type">Pet Type*</Label>
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
                  <SelectItem value="rabbit">Rabbit</SelectItem>
                  <SelectItem value="hamster">Hamster</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="reptile">Reptile</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender*</Label>
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
            <Label htmlFor="weight">Weight (Optional)</Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => handleFormChange("weight", e.target.value)}
              placeholder="Enter weight (e.g., 5 kg, 10 lbs)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date*</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleFormChange("birthDate", e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-muted-foreground">Required to calculate your pet's age</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={user?.name || ""}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddPet} 
            disabled={!formData.name.trim() || !formData.birthDate || isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Pet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetDialog;
