
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LocationMap } from '../components/LocationMap';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="text-pet-blue-dark mt-1" size={18} />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">(123) 456-7890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="text-pet-blue-dark mt-1" size={18} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">info@purrfectpaw.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-pet-blue-dark mt-1" size={18} />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">123 Pet Street, Baguio City, Philippines</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="text-pet-blue-dark mt-1" size={18} />
                    <div>
                      <p className="font-medium">Operating Hours</p>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 8:00 PM</p>
                      <p className="text-gray-600">Saturday: 9:00 AM - 5:00 PM</p>
                      <p className="text-gray-600">Sunday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-64 md:h-80 rounded-xl overflow-hidden">
                <LocationMap />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Send Us A Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pet-blue"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pet-blue"
                    placeholder="Your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pet-blue"
                    placeholder="Message subject"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pet-blue"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-pet-blue-dark hover:bg-pet-blue-dark/90 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
