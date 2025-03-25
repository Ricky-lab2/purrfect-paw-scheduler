
import { HeroSection } from "@/components/HeroSection";
import { ServiceCard } from "@/components/ServiceCard";
import { NotificationPreview } from "@/components/NotificationPreview";
import { PetChatbot } from "@/components/PetChatbot";
import { Link } from "react-router-dom";
import { Stethoscope, Scissors, Syringe, ShoppingBag, ChevronRight, Clock, Calendar, Award, Star, MapPin, User } from "lucide-react";
import { VetProfileCard } from "@/components/VetProfileCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { LocationMap } from "@/components/LocationMap";

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
            priceRange="1,500 - 5,000"
          />
          
          <ServiceCard
            title="Pet Grooming"
            description="Complete grooming services including bathing, haircuts, nail trimming, and ear cleaning."
            icon={Scissors}
            priceRange="800 - 2,500"
            iconClassName="from-pet-teal to-pet-teal-dark/90"
          />
          
          <ServiceCard
            title="Vaccinations"
            description="Essential vaccines to protect your pet against common diseases and maintain their health."
            icon={Syringe}
            priceRange="500 - 1,800"
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
      
      {/* Our Veterinarians */}
      <section className="bg-pet-gray py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Meet Our Expert Veterinarians</h2>
          <p className="section-subtitle">
            Our team of certified veterinarians brings years of experience and a genuine love for animals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <VetProfileCard
              name="Dr. Maria Santos"
              specialty="General Veterinary Medicine"
              experience={8}
              education="University of the Philippines"
              image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
              description="Dr. Santos specializes in preventive care and has a special interest in feline medicine. She is known for her gentle approach with anxious pets."
            />
            
            <VetProfileCard
              name="Dr. Antonio Reyes"
              specialty="Veterinary Surgery"
              experience={12}
              education="De La Salle University"
              image="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
              description="With over a decade of surgical experience, Dr. Reyes has performed thousands of procedures from routine spays to complex orthopedic surgeries."
            />
            
            <VetProfileCard
              name="Dr. Sophia Cruz"
              specialty="Exotic Pet Medicine"
              experience={6}
              education="Ateneo de Manila University"
              image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              description="Dr. Cruz has specialized training in the care of birds, reptiles, and small mammals. She is passionate about exotic pet welfare and education."
            />
          </div>
          
          <div className="text-center mt-10">
            <Link to="/veterinarians" className="inline-flex items-center gap-1 text-pet-blue-dark font-medium hover:underline">
              View All Veterinarians <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            We provide exceptional pet care with expertise, compassion, and state-of-the-art facilities including AI-powered care.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-pet-gray/30 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pet-teal/20 rounded-full flex items-center justify-center mb-4">
                <Award className="text-pet-teal-dark" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Expert Professionals</h3>
              <p className="text-muted-foreground">
                Our team of certified veterinarians and pet care specialists bring years of experience and a genuine love for animals.
              </p>
            </div>
            
            <div className="bg-pet-gray/30 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pet-blue/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-pet-blue-dark" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Convenient Hours</h3>
              <p className="text-muted-foreground">
                We offer flexible appointment times and emergency services to ensure your pet receives care when needed.
              </p>
            </div>
            
            <div className="bg-pet-gray/30 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pet-teal/20 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-pet-teal-dark" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">AI-Powered Support</h3>
              <p className="text-muted-foreground">
                Get instant answers to pet care questions with our AI chatbot assistant available 24/7 to provide guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="section-container bg-pet-gray/30">
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">
          Read trusted reviews from pet owners who have experienced our services firsthand.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <TestimonialCard
            name="Marco Diaz"
            petType="Dog Owner"
            rating={5}
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
            testimonial="Purrfect Paw has been taking care of my Labrador for years. Their team is professional, caring, and always goes the extra mile. I wouldn't trust anyone else with my pet's health!"
          />
          
          <TestimonialCard
            name="Elena Gomez"
            petType="Cat Owner"
            rating={5}
            image="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            testimonial="My cat had an emergency late at night, and the team at Purrfect Paw was available immediately. They handled everything with calm expertise. I'm incredibly grateful for their care."
          />
          
          <TestimonialCard
            name="Michael Tan"
            petType="Rabbit Owner"
            rating={4}
            image="https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
            testimonial="Finding a vet who knows exotic pets was challenging until I discovered Purrfect Paw. Dr. Cruz has been wonderful with my rabbit, providing specialized care I couldn't find elsewhere."
          />
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
      
      {/* Find Us / Location Map */}
      <section className="section-container bg-pet-gray/30">
        <h2 className="section-title">Find Us in Baguio City</h2>
        <p className="section-subtitle">
          Our clinic is conveniently located in the heart of Baguio City. Visit us or find nearby veterinary locations.
        </p>
        
        <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
          <LocationMap />
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <MapPin className="text-pet-blue-dark flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-lg">Purrfect Paw Veterinary Clinic</h3>
              <p className="text-muted-foreground">123 Session Road, Baguio City, Philippines</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Hours</h4>
                  <p className="text-sm text-muted-foreground">Monday - Friday: 8am - 8pm</p>
                  <p className="text-sm text-muted-foreground">Saturday: 9am - 6pm</p>
                  <p className="text-sm text-muted-foreground">Sunday: 10am - 4pm</p>
                </div>
                <div>
                  <h4 className="font-medium">Contact</h4>
                  <p className="text-sm text-muted-foreground">Phone: (074) 123-4567</p>
                  <p className="text-sm text-muted-foreground">Email: info@purrfectpaw.ph</p>
                  <p className="text-sm text-muted-foreground">Emergency: (074) 987-6543</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Chatbot */}
      <section className="section-container">
        <h2 className="section-title">AI Pet Care Assistant</h2>
        <p className="section-subtitle">
          Get instant answers to your pet care questions with our AI-powered chatbot.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <PetChatbot />
        </div>
      </section>
      
      {/* Notification Preview */}
      <NotificationPreview />
    </div>
  );
};

export default Index;
