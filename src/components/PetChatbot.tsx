
import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";
import { ApiKeyInput } from "./ApiKeyInput";
import { callOpenAI } from "@/services/openaiService";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  isError?: boolean;
};

// Sample suggested questions
const suggestedQuestions = [
  "How many years before a dog/cat can be vaccinated?",
  "What food is toxic for pets?",
  "How often should I groom my pet?",
  "Signs my pet needs to see a vet?",
  "What vaccines does my puppy need?"
];

interface PetChatbotProps {
  hideHeader?: boolean;
}

export function PetChatbot({ hideHeader = false }: PetChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your AI pet care assistant powered by OpenAI. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSendMessage = async (text: string = input) => {
    if (text.trim() === "" || isLoading) return;
    
    if (!apiKey) {
      const errorMessage: Message = {
        id: messages.length + 1,
        text: "Please set your OpenAI API key first to use the AI assistant.",
        isUser: false,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const aiResponse = await callOpenAI(text, apiKey);
      const botResponse: Message = {
        id: messages.length + 2,
        text: aiResponse,
        isUser: false
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: messages.length + 2,
        text: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.",
        isUser: false,
        isError: true
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-xs text-white/80">Powered by OpenAI - Ask me anything about pet care!</p>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {/* API Key Input */}
        {!apiKey && (
          <ApiKeyInput onApiKeySet={setApiKey} />
        )}
        
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-[80%] ${
                message.isUser 
                  ? "bg-pet-blue-dark text-white rounded-tr-none" 
                  : message.isError
                  ? "bg-red-50 border border-red-200 text-red-700 rounded-tl-none"
                  : "bg-white border border-gray-200 rounded-tl-none"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600">AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Only show suggestions if there are no messages beyond the initial greeting and API key is set */}
        {messages.length === 1 && apiKey && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
                className="text-xs bg-white border border-gray-200 py-1 px-3 rounded-full hover:bg-gray-100 transition-colors text-left disabled:opacity-50"
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
            placeholder={apiKey ? "Type your pet-related question here..." : "Please set your API key first..."}
            disabled={!apiKey || isLoading}
            className="flex-1 p-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-pet-blue-dark text-sm disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!apiKey || isLoading || !input.trim()}
            className="bg-pet-blue-dark text-white p-2 rounded-r-lg hover:bg-pet-blue-dark/90 transition-colors disabled:opacity-50 disabled:hover:bg-pet-blue-dark"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
