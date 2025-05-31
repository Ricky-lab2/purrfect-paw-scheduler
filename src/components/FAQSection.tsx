
import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const faqData = [
  {
    id: 1,
    question: "How many years before a dog/cat can be vaccinated?",
    answer: "Puppies and kittens can start their vaccination series at 6-8 weeks of age. The initial series typically continues until they're 16 weeks old, with boosters given annually or every three years depending on the vaccine type.",
    category: "vaccination"
  },
  {
    id: 2,
    question: "What foods are toxic for pets?",
    answer: "Common toxic foods include chocolate, grapes/raisins, onions, garlic, alcohol, caffeine, xylitol (artificial sweetener), macadamia nuts, and avocado. If your pet ingests any of these, contact us immediately.",
    category: "nutrition"
  },
  {
    id: 3,
    question: "How often should I groom my pet?",
    answer: "Grooming frequency depends on your pet's breed and coat type. Generally, dogs need grooming every 4-6 weeks, while cats groom themselves but may need professional grooming every 6-8 weeks for long-haired breeds.",
    category: "grooming"
  },
  {
    id: 4,
    question: "What are signs my pet needs to see a vet?",
    answer: "Warning signs include loss of appetite, lethargy, vomiting, diarrhea, difficulty breathing, excessive drinking/urination, limping, or behavioral changes. When in doubt, it's better to consult with us.",
    category: "health"
  },
  {
    id: 5,
    question: "What vaccines does my puppy need?",
    answer: "Core vaccines for puppies include DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza) and Rabies. Non-core vaccines may include Bordetella, Lyme disease, and Canine Influenza, depending on your puppy's lifestyle and risk factors.",
    category: "vaccination"
  },
  {
    id: 6,
    question: "How much does a consultation cost?",
    answer: "General consultations start at ₱1,500. Vaccination services are ₱800, grooming starts at ₱2,000, and emergency consultations are ₱3,000. Prices may vary based on specific treatments needed.",
    category: "pricing"
  },
  {
    id: 7,
    question: "What should I bring to my first appointment?",
    answer: "Please bring any previous medical records, a list of current medications, your pet's vaccination history, and a list of questions or concerns. Keep dogs on leashes and cats in carriers.",
    category: "appointment"
  },
  {
    id: 8,
    question: "Do you handle reptile care?",
    answer: "Yes! We provide comprehensive care for reptiles including snakes, lizards, turtles, geckos, iguanas, and other exotic pets. Our team has specialized training in reptile medicine and husbandry.",
    category: "species"
  },
  {
    id: 9,
    question: "What are your emergency hours?",
    answer: "We provide 24/7 emergency services. Our regular hours are Monday-Friday 8AM-8PM, Saturday 9AM-5PM, and Sunday 10AM-4PM. For after-hours emergencies, call our emergency hotline.",
    category: "hours"
  },
  {
    id: 10,
    question: "How do I prepare my pet for surgery?",
    answer: "Your pet should fast for 8-12 hours before surgery (no food, but water is usually okay until 2 hours before). We'll provide specific pre-surgical instructions when you schedule the procedure.",
    category: "surgery"
  }
];

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "vaccination", label: "Vaccination" },
    { value: "nutrition", label: "Nutrition" },
    { value: "grooming", label: "Grooming" },
    { value: "health", label: "Health Signs" },
    { value: "pricing", label: "Pricing" },
    { value: "appointment", label: "Appointments" },
    { value: "species", label: "Pet Species" },
    { value: "hours", label: "Hours & Emergency" },
    { value: "surgery", label: "Surgery" }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>
          Find quick answers to common pet care questions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pet-blue-dark"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No FAQs found matching your search criteria.
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <Collapsible key={faq.id} open={openItems.includes(faq.id)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left border border-gray-200 rounded-lg hover:bg-pet-gray"
                    onClick={() => toggleItem(faq.id)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openItems.includes(faq.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="pt-2 text-sm text-muted-foreground border-l-4 border-pet-blue pl-4">
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </div>

        {/* Contact for More Questions */}
        <div className="bg-pet-blue/10 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't find what you're looking for?
          </p>
          <Button variant="outline" size="sm">
            Contact Our Team
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
