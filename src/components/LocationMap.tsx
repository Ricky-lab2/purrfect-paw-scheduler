
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Store } from "lucide-react";

// Define partner pet shops data with more structured information
const partnerShops = [
  { 
    id: 1,
    name: "PetExpress Baguio", 
    position: "top-1/3 left-1/4",
    location: "123 Session Road, Baguio City",
    phone: "(074) 123-4567"
  },
  { 
    id: 2,
    name: "Pet Kingdom", 
    position: "bottom-1/3 right-1/4",
    location: "45 Leonard Wood Road, Baguio City",
    phone: "(074) 765-4321"
  },
  { 
    id: 3,
    name: "Pet Supply Hub", 
    position: "top-1/4 right-1/3",
    location: "78 Magsaysay Avenue, Baguio City",
    phone: "(074) 555-7890"
  },
];

export function LocationMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real implementation, we would load a proper map library like Google Maps or Mapbox
    // For demo purposes, we're using a static image
    setMapLoaded(true);
  }, []);
  
  const handleShopClick = (shopId: number) => {
    setSelectedShop(selectedShop === shopId ? null : shopId);
  };
  
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 relative">
        <div ref={mapRef} className="w-full h-[400px] md:h-[500px] overflow-hidden relative">
          {/* Using a static map image of Baguio City */}
          <img 
            src="https://maps.googleapis.com/maps/api/staticmap?center=Baguio+City,Philippines&zoom=14&size=1200x500&scale=2&maptype=roadmap&markers=color:red%7CSession+Road,Baguio+City,Philippines" 
            alt="Map of Baguio City" 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay for clinic location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-pet-blue-dark text-white px-3 py-1 rounded-md shadow-lg flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-pet-blue transition-colors">
              <MapPin size={16} />
              <span>Purrfect Paw Clinic</span>
            </div>
          </div>
          
          {/* Partner pet shops - dynamically rendered from partners data */}
          {partnerShops.map((shop) => (
            <div 
              key={shop.id} 
              className={`absolute ${shop.position}`}
              onClick={() => handleShopClick(shop.id)}
            >
              <div className={`${selectedShop === shop.id ? 'bg-pet-teal text-white' : 'bg-white text-pet-blue-dark'} px-2 py-1 rounded-md shadow-md text-xs flex items-center gap-1 cursor-pointer hover:bg-pet-teal hover:text-white transition-colors`}>
                <Store size={12} />
                {shop.name}
              </div>
              
              {/* Info popup when shop is selected */}
              {selectedShop === shop.id && (
                <div className="absolute top-full left-0 mt-1 bg-white p-2 rounded-md shadow-lg z-10 w-48">
                  <p className="text-xs font-medium">{shop.name}</p>
                  <p className="text-xs text-gray-600">{shop.location}</p>
                  <p className="text-xs text-gray-600">{shop.phone}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Map controls/legend */}
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
          <div className="text-sm font-medium mb-2">Location Legend</div>
          
          <div className="flex items-center gap-2 text-xs mb-1">
            <div className="w-3 h-3 rounded-full bg-pet-blue-dark"></div>
            <span>Our Clinic</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-pet-teal"></div>
            <span>Partner Pet Shops</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
