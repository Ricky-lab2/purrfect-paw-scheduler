
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PetFormData, DEFAULT_PET_FORM } from "./AddPetDialog";

export type Pet = {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird" | "other";
  breed?: string;
  birthDate: string;
  gender: "male" | "female";
  ownerId: string;
};

interface EditPetDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentPet: Pet | null;
  onPetUpdated: () => void;
}

const EditPetDialog = ({ isOpen, setIsOpen, currentPet, onPetUpdated }: EditPetDialogProps) => {
  const { updatePet, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PetFormData>(DEFAULT_PET_FORM);
  
  useEffect(() => {
    if (currentPet) {
      setFormData({
        name: currentPet.name,
        type: currentPet.type,
        breed: currentPet.breed || "",
        birthDate: currentPet.birthDate,
        gender: currentPet.gender
      });
    }
  }, [currentPet]);
  
  const handleFormChange = (field: keyof PetFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleEditPet = () => {
    if (!currentPet) return;
    
    if (!formData.birthDate) {
      toast({
        title: "Birth date required",
        description: "Please enter your pet's birth date.",
        variant: "destructive",
      });
      return;
    }
    
    const success = updatePet(currentPet.id, formData);
    
    if (success) {
      onPetUpdated();
      setIsOpen(false);
      
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
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pet</DialogTitle>
          <DialogDescription>
            Update your pet's information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Pet Name*</Label>
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
              <Label htmlFor="edit-type">Pet Type*</Label>
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
              <Label htmlFor="edit-gender">Gender*</Label>
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
            <Label htmlFor="edit-birthDate">Birth Date*</Label>
            <Input
              id="edit-birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleFormChange("birthDate", e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-muted-foreground">Required to calculate your pet's age</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-owner">Owner</Label>
            <Input
              id="edit-owner"
              value={user?.name || ""}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditPet} disabled={!formData.name || !formData.birthDate}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPetDialog;
