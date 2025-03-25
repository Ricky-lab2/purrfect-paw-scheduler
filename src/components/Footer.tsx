
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-full bg-pet-blue-dark flex items-center justify-center">
                <span className="font-bold text-white text-lg">PP</span>
              </span>
              <span className="font-display font-semibold text-xl">Purrfect Paw</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Premium pet care services for your beloved companions. 
              Professional veterinary care, grooming, and retail.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-pet-gray-dark hover:text-pet-blue-dark transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-pet-gray-dark hover:text-pet-blue-dark transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-pet-gray-dark hover:text-pet-blue-dark transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-pet-blue-dark text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-pet-blue-dark text-sm transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="text-muted-foreground hover:text-pet-blue-dark text-sm transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-pet-blue-dark text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-pet-blue-dark text-sm transition-colors">
                  Veterinary Care
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-pet-blue-dark text-sm transition-colors">
                  Pet Grooming
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-pet-blue-dark text-sm transition-colors">
                  Vaccinations
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-pet-blue-dark text-sm transition-colors">
                  Pet Shop
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-pet-blue-dark shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Pet Street, Baguio City, Philippines
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-pet-blue-dark shrink-0" />
                <span className="text-sm text-muted-foreground">
                  (123) 456-7890
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-pet-blue-dark shrink-0" />
                <span className="text-sm text-muted-foreground">
                  info@purrfectpaw.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Purrfect Paw Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
