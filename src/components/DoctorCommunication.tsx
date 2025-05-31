
import { useState } from "react";
import { MessageCircle, Phone, Video, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PetChatbot } from "./PetChatbot";

export function DoctorCommunication() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-pet-blue-dark" />
          Communicate with Dr. Santos
        </CardTitle>
        <CardDescription>
          Connect with our veterinary team for consultations and follow-ups
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Chat with Doctor */}
          <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
                <MessageCircle className="h-6 w-6 text-pet-blue-dark" />
                <div className="text-center">
                  <div className="font-medium">AI Pet Consultation</div>
                  <div className="text-xs text-muted-foreground">Instant answers</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 h-[600px] max-h-[80vh] overflow-hidden">
              <DialogHeader className="bg-pet-blue-dark text-white py-3 px-4">
                <DialogTitle className="text-base">Dr. Santos AI Assistant</DialogTitle>
                <DialogDescription className="text-white/80 text-xs">
                  Get instant pet care advice powered by AI
                </DialogDescription>
              </DialogHeader>
              <div className="h-full overflow-hidden">
                <PetChatbot hideHeader={true} />
              </div>
            </DialogContent>
          </Dialog>

          {/* Schedule Video Call */}
          <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
            <Video className="h-6 w-6 text-green-600" />
            <div className="text-center">
              <div className="font-medium">Video Consultation</div>
              <div className="text-xs text-muted-foreground">₱2,000 / 30 mins</div>
            </div>
          </Button>

          {/* Phone Consultation */}
          <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
            <Phone className="h-6 w-6 text-blue-600" />
            <div className="text-center">
              <div className="font-medium">Phone Consultation</div>
              <div className="text-xs text-muted-foreground">₱1,500 / 20 mins</div>
            </div>
          </Button>

          {/* Schedule In-Person */}
          <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
            <Calendar className="h-6 w-6 text-purple-600" />
            <div className="text-center">
              <div className="font-medium">In-Person Visit</div>
              <div className="text-xs text-muted-foreground">Book appointment</div>
            </div>
          </Button>
        </div>

        <div className="bg-pet-gray rounded-lg p-4">
          <h4 className="font-medium mb-2">Dr. Maria Santos, DVM</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Veterinarian with 15+ years of experience in small animal care, surgery, and emergency medicine.
          </p>
          <div className="text-xs text-muted-foreground">
            <p>• Available: Monday-Friday 8AM-6PM</p>
            <p>• Emergency consultations: 24/7</p>
            <p>• Specialized in: Surgery, Internal Medicine, Dermatology</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            For emergencies, call our 24/7 hotline: <strong>(123) 456-7890</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
