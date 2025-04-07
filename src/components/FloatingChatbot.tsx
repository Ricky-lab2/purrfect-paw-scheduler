
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PetChatbot } from "./PetChatbot";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-pet-blue-dark text-white shadow-lg flex items-center justify-center hover:bg-pet-blue hover:scale-105 transition-all"
        aria-label="Open AI Pet Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Dialog for chatbot */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0 h-[600px] max-h-[80vh] overflow-hidden">
          <DialogHeader className="bg-pet-blue-dark text-white p-4">
            <DialogTitle>Purrfect Paw AI Assistant</DialogTitle>
            <DialogDescription className="text-white/80">
              Ask me anything about pet care!
            </DialogDescription>
          </DialogHeader>
          <div className="h-full overflow-hidden">
            <PetChatbot hideHeader={true} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
