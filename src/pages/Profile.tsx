
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UserRound, Mail, Edit } from "lucide-react";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserProfile({ name });
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    
    setIsEditing(false);
  };
  
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Profile Information</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Input
                      id="role"
                      value={user?.role === "admin" ? "Administrator" : "Customer"}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-pet-blue flex items-center justify-center text-white">
                      <UserRound size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground">
                Your account was created on {' '}
                {user?.id.startsWith("customer-") 
                  ? new Date(parseInt(user.id.replace("customer-", ""))).toLocaleDateString() 
                  : "N/A"}
              </p>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-3 flex gap-4">
          <Button variant="outline" asChild className="flex-1">
            <a href="/my-pets">Manage Pets</a>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <a href="/my-appointments">View Appointments</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
