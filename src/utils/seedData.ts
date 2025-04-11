
import { seedInitialData } from "./localStorageDB";

// Seed initial appointment data
export const initializeData = () => {
  // Seed appointments if none exist
  seedInitialData();
  
  // Seed pets if none exist
  const storedPets = localStorage.getItem("pets");
  if (!storedPets || JSON.parse(storedPets).length === 0) {
    const samplePets = [
      {
        id: "pet-1680678400000",
        name: "Max",
        type: "dog",
        breed: "Golden Retriever",
        birthDate: "2020-05-15",
        gender: "male",
        ownerId: "customer-1"
      },
      {
        id: "pet-1680678400001",
        name: "Luna",
        type: "cat",
        breed: "Siamese",
        birthDate: "2019-10-23",
        gender: "female",
        ownerId: "customer-1"
      }
    ];
    
    localStorage.setItem("pets", JSON.stringify(samplePets));
  }
};
