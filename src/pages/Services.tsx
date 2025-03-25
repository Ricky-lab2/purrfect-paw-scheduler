import { useState } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { Stethoscope, Scissors, Syringe, ShoppingBag, HeartPulse, Microscope, Beaker, Brain, Pill, Cat, Dog, Rabbit } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingItem {
  service: string;
  price: string;
  description: string;
}

interface PricingCategory {
  category: string;
  items: PricingItem[];
}

const Services = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  
  const pricingData: Record<string, PricingCategory[]> = {
    general: [
      {
        category: "Consultations & Exams",
        items: [
          {
            service: "General Check-up",
            price: "$50 - $75",
            description: "Comprehensive physical examination"
          },
          {
            service: "New Patient Consultation",
            price: "$75 - $100",
            description: "Initial visit with health assessment"
          },
          {
            service: "Follow-up Appointment",
            price: "$40 - $60",
            description: "Progress evaluation visit"
          },
          {
            service: "Emergency Consultation",
            price: "$100 - $150",
            description: "Urgent care examination"
          }
        ]
      },
      {
        category: "Preventive Care",
        items: [
          {
            service: "Annual Wellness Package",
            price: "$150 - $250",
            description: "Complete yearly check-up with basic tests"
          },
          {
            service: "Senior Pet Care Package",
            price: "$200 - $300",
            description: "Enhanced check-up for older pets"
          },
          {
            service: "Dental Check-up",
            price: "$60 - $90",
            description: "Oral examination and assessment"
          }
        ]
      }
    ],
    vaccination: [
      {
        category: "Core Vaccines",
        items: [
          {
            service: "DHPP/FVRCP (Dog/Cat)",
            price: "$25 - $45",
            description: "Essential protection against common diseases"
          },
          {
            service: "Rabies Vaccine",
            price: "$20 - $30",
            description: "Required by law in most areas"
          },
          {
            service: "Bordetella (Kennel Cough)",
            price: "$25 - $40",
            description: "Protection for social/boarding dogs"
          }
        ]
      },
      {
        category: "Non-Core Vaccines",
        items: [
          {
            service: "Leptospirosis",
            price: "$25 - $35",
            description: "For dogs with outdoor exposure"
          },
          {
            service: "Lyme Disease",
            price: "$35 - $45",
            description: "For dogs in tick-prevalent areas"
          },
          {
            service: "Feline Leukemia",
            price: "$30 - $40",
            description: "For cats with outdoor access"
          }
        ]
      }
    ],
    grooming: [
      {
        category: "Basic Grooming",
        items: [
          {
            service: "Bath & Brush (Small)",
            price: "$30 - $45",
            description: "For dogs under 25lbs"
          },
          {
            service: "Bath & Brush (Medium)",
            price: "$45 - $60",
            description: "For dogs 25-50lbs"
          },
          {
            service: "Bath & Brush (Large)",
            price: "$60 - $80",
            description: "For dogs over 50lbs"
          },
          {
            service: "Cat Grooming",
            price: "$50 - $70",
            description: "Specialized feline grooming service"
          }
        ]
      },
      {
        category: "Full Service Grooming",
        items: [
          {
            service: "Full Groom (Small)",
            price: "$60 - $80",
            description: "Bath, haircut, nails, ears for small pets"
          },
          {
            service: "Full Groom (Medium)",
            price: "$80 - $100",
            description: "Bath, haircut, nails, ears for medium pets"
          },
          {
            service: "Full Groom (Large)",
            price: "$100 - $130",
            description: "Bath, haircut, nails, ears for large pets"
          }
        ]
      }
    ],
    surgery: [
      {
        category: "Routine Procedures",
        items: [
          {
            service: "Spay/Neuter (Cat)",
            price: "$150 - $300",
            description: "Reproductive surgery for cats"
          },
          {
            service: "Spay/Neuter (Dog Small)",
            price: "$200 - $400",
            description: "Reproductive surgery for small dogs"
          },
          {
            service: "Spay/Neuter (Dog Large)",
            price: "$300 - $500",
            description: "Reproductive surgery for large dogs"
          },
          {
            service: "Dental Cleaning",
            price: "$300 - $600",
            description: "Professional cleaning under anesthesia"
          }
        ]
      },
      {
        category: "Specialized Procedures",
        items: [
          {
            service: "Tumor Removal",
            price: "$400 - $1,000+",
            description: "Depending on size and location"
          },
          {
            service: "Orthopedic Surgery",
            price: "$1,500 - $4,000+",
            description: "Joint repair or bone fixation"
          },
          {
            service: "Soft Tissue Surgery",
            price: "$800 - $2,500+",
            description: "Internal organ procedures"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Services Header */}
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Services</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive pet care services tailored to keep your companions healthy and happy throughout every stage of their lives.
            </p>
          </div>
        </div>
      </section>
      
      {/* Services Grid */}
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            title="Veterinary Care"
            description="Complete medical care including examinations, diagnostics, treatments, and preventive services."
            icon={Stethoscope}
          />
          
          <ServiceCard
            title="Pet Grooming"
            description="Professional grooming services to keep your pet clean, comfortable, and looking their best."
            icon={Scissors}
            iconClassName="from-pet-teal to-pet-teal-dark/90"
          />
          
          <ServiceCard
            title="Vaccinations"
            description="Essential vaccines to protect your pet against common infectious diseases."
            icon={Syringe}
            iconClassName="from-pet-blue-dark to-pet-blue"
          />
          
          <ServiceCard
            title="Pet Shop"
            description="Quality pet food, toys, accessories, and healthcare products for all your pet's needs."
            icon={ShoppingBag}
            iconClassName="from-pet-teal-dark to-pet-teal"
          />
          
          <ServiceCard
            title="Surgery"
            description="From routine procedures to complex operations, with modern equipment and techniques."
            icon={HeartPulse}
          />
          
          <ServiceCard
            title="Diagnostic Services"
            description="Advanced testing and imaging to accurately diagnose health conditions."
            icon={Microscope}
            iconClassName="from-pet-teal to-pet-teal-dark/90"
          />
          
          <ServiceCard
            title="Laboratory Testing"
            description="In-house and reference lab services for fast and accurate test results."
            icon={Beaker}
            iconClassName="from-pet-blue-dark to-pet-blue"
          />
          
          <ServiceCard
            title="Behavioral Consultations"
            description="Professional advice for addressing behavioral issues and training challenges."
            icon={Brain}
            iconClassName="from-pet-teal-dark to-pet-teal"
          />
          
          <ServiceCard
            title="Pharmacy Services"
            description="Convenient access to medications and prescription diets for your pet."
            icon={Pill}
          />
        </div>
      </section>
      
      {/* Species-Specific Care */}
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Specialized Care for All Pets</h2>
          <p className="section-subtitle">
            We provide tailored care for different species, recognizing the unique needs of each type of pet.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-pet-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dog className="text-pet-blue-dark" size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2">Dogs</h3>
              <p className="text-muted-foreground">
                Comprehensive care for canines of all breeds and sizes, from puppies to seniors.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-pet-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cat className="text-pet-teal-dark" size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2">Cats</h3>
              <p className="text-muted-foreground">
                Specialized feline care in a cat-friendly environment designed to reduce stress.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-pet-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rabbit className="text-pet-blue-dark" size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2">Exotic Pets</h3>
              <p className="text-muted-foreground">
                Expert care for birds, reptiles, small mammals and other exotic pets.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing & Services */}
      <section className="section-container">
        <h2 className="section-title">Service Pricing</h2>
        <p className="section-subtitle">
          Transparent pricing for our most common services. All prices are approximate and may vary based on your pet's specific needs.
        </p>
        
        {/* Pricing Tabs */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.keys(pricingData).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === key 
                    ? "bg-pet-blue-dark text-white" 
                    : "bg-pet-gray hover:bg-pet-gray-dark/10"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Pricing Tables */}
          <div className="space-y-8 animate-fade-in">
            {pricingData[activeTab].map((category, index) => (
              <div key={index}>
                <h3 className="text-xl font-medium mb-4">{category.category}</h3>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="grid grid-cols-12 bg-pet-gray font-medium text-sm py-3 px-4">
                    <div className="col-span-5 md:col-span-6">Service</div>
                    <div className="col-span-3 md:col-span-2">Price</div>
                    <div className="col-span-4 md:col-span-4">Description</div>
                  </div>
                  
                  {category.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className="grid grid-cols-12 py-3 px-4 border-t border-gray-100 text-sm"
                    >
                      <div className="col-span-5 md:col-span-6 font-medium">{item.service}</div>
                      <div className="col-span-3 md:col-span-2 text-pet-blue-dark">{item.price}</div>
                      <div className="col-span-4 md:col-span-4 text-muted-foreground">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ready to schedule an appointment for any of our services?
          </p>
          <Link 
            to="/appointment" 
            className="inline-block px-6 py-3 bg-pet-blue-dark text-white rounded-lg hover:bg-pet-blue-dark/90 transition-colors shadow-sm"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
