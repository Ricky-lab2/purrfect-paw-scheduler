
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Edit2, Save, User as UserIcon } from "lucide-react";

const Profile = () => {
  const { user, updateUserInfo, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.userInfo.name || "",
    email: user?.userInfo.email || "",
    phone: user?.userInfo.phone || "",
    address: user?.userInfo.address || "",
  });

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center p-12">
            <h1 className="text-2xl font-semibold mb-4">Please log in to view your profile</h1>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserInfo({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    });
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-pet-blue-dark rounded-full mx-auto flex items-center justify-center">
                  <span className="text-4xl font-semibold text-white">
                    {user.userInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <CardTitle className="mt-4">{user.userInfo.name}</CardTitle>
                <CardDescription>{user.userInfo.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? "Administrator" : "Customer"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <Save className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium block mb-1">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium block mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-sm font-medium block mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="text-sm font-medium block mb-1">
                        Address
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6">
                      <Button type="submit" className="bg-pet-blue-dark hover:bg-pet-blue-dark/90">
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
