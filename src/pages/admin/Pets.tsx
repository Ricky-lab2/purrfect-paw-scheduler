
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PawPrint, Search } from "lucide-react";
import { useState } from "react";

// Sample data
const petsData = [
  {
    id: "PET001",
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    age: "3 years",
    ownerName: "John Doe",
    lastVisit: "2025-04-01",
  },
  {
    id: "PET002",
    name: "Luna",
    species: "Cat",
    breed: "Persian",
    age: "2 years",
    ownerName: "Sarah Johnson",
    lastVisit: "2025-03-28",
  },
  {
    id: "PET003",
    name: "Bella",
    species: "Dog",
    breed: "Poodle",
    age: "4 years",
    ownerName: "Michael Smith",
    lastVisit: "2025-03-25",
  },
  {
    id: "PET004",
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    age: "1 year",
    ownerName: "Jessica Williams",
    lastVisit: "2025-04-02",
  },
  {
    id: "PET005",
    name: "Oliver",
    species: "Cat",
    breed: "Maine Coon",
    age: "5 years",
    ownerName: "David Brown",
    lastVisit: "2025-03-30",
  },
];

const Pets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("All");

  const filteredPets = petsData.filter(pet => {
    // Filter by search term
    const searchMatch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by species
    const speciesMatch = filterSpecies === "All" || pet.species === filterSpecies;

    return searchMatch && speciesMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Pets Registry</h2>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pet-blue-dark text-white hover:bg-pet-blue-dark/90 h-10 px-4 py-2">
          <PawPrint className="mr-2 h-4 w-4" />
          Add New Pet
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pets..."
            className="pl-10 pr-4 py-2 w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-pet-blue-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border rounded-md"
          value={filterSpecies}
          onChange={(e) => setFilterSpecies(e.target.value)}
        >
          <option value="All">All Species</option>
          <option value="Dog">Dogs</option>
          <option value="Cat">Cats</option>
          <option value="Bird">Birds</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Pets Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPets.map((pet) => (
              <TableRow key={pet.id}>
                <TableCell className="font-medium">{pet.id}</TableCell>
                <TableCell>{pet.name}</TableCell>
                <TableCell>{pet.species}</TableCell>
                <TableCell>{pet.breed}</TableCell>
                <TableCell>{pet.age}</TableCell>
                <TableCell>{pet.ownerName}</TableCell>
                <TableCell>{pet.lastVisit}</TableCell>
                <TableCell>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {filteredPets.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No pets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Pets;
