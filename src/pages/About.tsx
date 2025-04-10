
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Purrfect Paw</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            Welcome to Purrfect Paw, where we provide exceptional veterinary care for your beloved pets in Baguio City.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
          <p>
            At Purrfect Paw, our mission is to provide the highest quality veterinary care with compassion and respect for our patients and their human companions. We strive to educate pet owners about proper pet care and preventative measures to ensure their pets live long, healthy, and happy lives.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Vision</h2>
          <p>
            To be the leading veterinary clinic in Baguio City, known for exceptional care, innovative treatments, and a warm, welcoming environment that reduces the stress of veterinary visits for both pets and their owners.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Values</h2>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li><strong>Compassion:</strong> We treat every animal with kindness and understanding.</li>
            <li><strong>Excellence:</strong> We continually strive to improve our knowledge and skills.</li>
            <li><strong>Integrity:</strong> We are honest and trustworthy in all our interactions.</li>
            <li><strong>Education:</strong> We believe in empowering pet owners with knowledge.</li>
            <li><strong>Community:</strong> We are committed to serving our local community.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our History</h2>
          <p>
            Founded in 2015, Purrfect Paw began as a small clinic with a team of just three dedicated professionals. Over the years, we've grown into a full-service veterinary hospital, equipped with modern facilities and staffed by an expanded team of veterinarians and support staff who are passionate about animal care.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Our Team</h2>
          <p>
            Our team consists of experienced veterinarians, trained veterinary nurses, and friendly administrative staff. Each member brings unique skills and perspectives, united by their love for animals and commitment to providing the best care possible.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
