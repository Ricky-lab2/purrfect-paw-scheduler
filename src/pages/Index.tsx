
import { HeroSection } from "@/components/HeroSection";
import { ServiceCard } from "@/components/ServiceCard";
import { NotificationPreview } from "@/components/NotificationPreview";
import { Link } from "react-router-dom";
import { Stethoscope, Scissors, Syringe, ShoppingBag, ChevronRight, Clock, Calendar, Award } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Services Overview */}
      <section className="section-container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Comprehensive care solutions for all of your pet's needs, delivered with expertise and compassion.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            title="Veterinary Care"
            description="Professional medical care for pets, including diagnostics, treatments, and preventive services."
            icon={Stethoscope}
            priceRange="$50 - $200"
          />
          
          <ServiceCard
            title="Pet Grooming"
            description="Complete grooming services including bathing, haircuts, nail trimming, and ear cleaning."
            icon={Scissors}
            priceRange="$30 - $100"
            iconClassName="from-pet-teal to-pet-teal-dark/90"
          />
          
          <ServiceCard
            title="Vaccinations"
            description="Essential vaccines to protect your pet against common diseases and maintain their health."
            icon={Syringe}
            priceRange="$25 - $75"
            iconClassName="from-pet-blue-dark to-pet-blue"
          />
          
          <ServiceCard
            title="Pet Shop"
            description="Quality pet supplies, food, toys, and accessories for all your pet's needs."
            icon={ShoppingBag}
            priceRange="Varies"
            iconClassName="from-pet-teal-dark to-pet-teal"
          />
        </div>
        
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-1 text-pet-blue-dark font-medium hover:underline">
            View All Services <ChevronRight size={16} />
          </Link>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="bg-pet-gray py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            We provide exceptional pet care with expertise, compassion, and state-of-the-art facilities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pet-teal/20 rounded-full flex items-center justify-center mb-4">
                <Award className="text-pet-teal-dark" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Expert Professionals</h3>
              <p className="text-muted-foreground">
                Our team of certified veterinarians and pet care specialists bring years of experience and a genuine love for animals.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pet-blue/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-pet-blue-dark" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Convenient Hours</h3>
              <p className="text-muted-foreground">
                We offer flexible appointment times and emergency services to ensure your pet receives care when needed.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pet-teal/20 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-pet-teal-dark" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Easy Scheduling</h3>
              <p className="text-muted-foreground">
                Book appointments online with our easy-to-use system and receive automatic reminders before your visit.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Appointment CTA */}
      <section className="section-container">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img 
              src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Pet clinic" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pet-blue-dark/90 to-pet-blue-dark/70"></div>
          </div>
          
          <div className="relative z-10 py-16 px-6 md:py-20 md:px-12 lg:px-16 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-white">
              Schedule an Appointment Today
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Whether it's a routine checkup, grooming session, or specialized treatment, our team is ready to provide exceptional care for your beloved pet.
            </p>
            <Link 
              to="/appointment" 
              className="inline-block px-8 py-4 bg-white text-pet-blue-dark font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Book Your Appointment
            </Link>
          </div>
        </div>
      </section>
      
      {/* Notification Preview */}
      <NotificationPreview />
    </div>
  );
};

export default Index;
