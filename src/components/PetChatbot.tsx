
import { useState, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

// Sample suggested questions
const suggestedQuestions = [
  "How many years before a dog/cat can be vaccinated?",
  "What food is toxic for pets?",
  "How often should I groom my pet?",
  "Signs my pet needs to see a vet?",
  "What vaccines does my puppy need?"
];

// Sample pet care knowledge base
const petKnowledgeBase = [
  {
    keywords: ["dog", "food", "eat", "feeding"],
    response: "Dogs should be fed high-quality dog food appropriate for their age, size, and activity level. Adult dogs typically need to be fed twice a day. Make sure fresh water is always available."
  },
  {
    keywords: ["cat", "food", "eat", "feeding"],
    response: "Cats need a balanced diet rich in protein. Most adult cats should be fed twice a day. Some cats prefer to graze throughout the day. Ensure fresh water is always available."
  },
  {
    keywords: ["vaccine", "vaccination", "shots", "vaccinated"],
    response: "Puppies and kittens can typically start their vaccination series at 6-8 weeks of age. The core vaccination schedule usually continues until they're about 16 weeks old. Adult pets need regular boosters, usually annually or every three years depending on the vaccine."
  },
  {
    keywords: ["flea", "tick", "parasite"],
    response: "Fleas and ticks can cause serious health issues. We recommend year-round prevention with monthly treatments. There are various options including topical treatments, oral medications, and collars."
  },
  {
    keywords: ["groom", "grooming", "bath", "nail", "fur"],
    response: "Regular grooming is important for your pet's health and comfort. This includes brushing, bathing, nail trimming, and ear cleaning. The frequency depends on your pet's breed and coat type."
  },
  {
    keywords: ["emergency", "urgent", "help"],
    response: "If your pet is experiencing an emergency such as difficulty breathing, severe bleeding, or suspected poisoning, please call our emergency line immediately at (123) 456-7890 or visit our clinic right away."
  },
  {
    keywords: ["price", "cost", "fee", "peso"],
    response: "Our services range from ₱500 for basic consultations to ₱5,000 for more complex procedures. Grooming services start at ₱800. Please visit our Services page for detailed pricing information."
  },
  {
    keywords: ["hours", "open", "schedule", "timing"],
    response: "Purrfect Paw is open Monday through Friday from 8:00 AM to 8:00 PM, Saturday from 9:00 AM to 5:00 PM, and Sunday from 10:00 AM to 4:00 PM. Emergency services are available 24/7."
  },
  {
    keywords: ["location", "address", "where", "baguio"],
    response: "We are located at 123 Pet Street, Baguio City, Philippines. We're near the city center with ample parking available."
  },
  {
    keywords: ["toxic", "poison", "dangerous"],
    response: "Common foods toxic to pets include chocolate, grapes/raisins, onions, garlic, alcohol, caffeine, and xylitol (artificial sweetener). If you suspect your pet has eaten something toxic, contact our emergency line immediately."
  }
];

// Function to find a response based on keywords
const findResponse = (query: string): string => {
  const lowercaseQuery = query.toLowerCase();
  
  for (const entry of petKnowledgeBase) {
    if (entry.keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      return entry.response;
    }
  }
  
  return "I don't have specific information about that. For detailed assistance, please call us at (123) 456-7890 or visit our clinic in Baguio City.";
};

interface PetChatbotProps {
  hideHeader?: boolean;
}

export function PetChatbot({ hideHeader = false }: PetChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your AI pet care assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSendMessage = (text: string = input) => {
    if (text.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI thinking with a slight delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: findResponse(text),
        isUser: false
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md h-full flex flex-col">
      {!hideHeader && (
        <div className="bg-pet-blue-dark text-white py-2 px-4">
          <h3 className="text-base font-medium">Purrfect Paw AI Assistant</h3>
          <p className="text-xs text-white/80">Ask me anything about pet care!</p>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-[80%] ${
                message.isUser 
                  ? "bg-pet-blue-dark text-white rounded-tr-none" 
                  : "bg-white border border-gray-200 rounded-tl-none"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {/* Only show suggestions if there are no messages beyond the initial greeting */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="text-xs bg-white border border-gray-200 py-1 px-3 rounded-full hover:bg-gray-100 transition-colors text-left"
              >
                {question}
              </button>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            className="flex-1 p-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-pet-blue-dark text-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-pet-blue-dark text-white p-2 rounded-r-lg hover:bg-pet-blue-dark/90 transition-colors"
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
