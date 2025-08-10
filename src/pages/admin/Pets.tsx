
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PawPrint, Search, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  type: string;
  weight?: string;
  birth_date: string;
  gender: string;
  owner_id: string;
  created_at: string;
}

interface Profile {
  name: string;
}

const Pets = () => {
  const { toast } = useToast();
  const [pets, setPets] = useState<(Pet & { ownerName: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    setIsLoading(true);
    try {
      // First get pets
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (petsError) throw petsError;

      // Then get profiles to match with owner names
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name');

      if (profilesError) throw profilesError;

      // Map pets with owner names
      const petsWithOwnerNames = petsData?.map(pet => {
        const ownerProfile = profilesData?.find(profile => profile.id === pet.owner_id);
        return {
          ...pet,
          ownerName: ownerProfile?.name || 'Unknown Owner'
        };
      }) || [];
      
      setPets(petsWithOwnerNames);
    } catch (error) {
      console.error("Error loading pets:", error);
      toast({
        title: "Error",
        description: "Could not load pets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
  };

  const filteredPets = pets.filter(pet => {
    // Filter by search term
    const searchMatch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Clock className="animate-spin h-4 w-4 mr-2" />
                    Loading pets...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium">{pet.id.slice(0, 8)}...</TableCell>
                  <TableCell>{pet.name}</TableCell>
                  <TableCell>{pet.species}</TableCell>
                  <TableCell>{pet.breed || 'Mixed'}</TableCell>
                  <TableCell>{calculateAge(pet.birth_date)}</TableCell>
                  <TableCell>{pet.ownerName}</TableCell>
                  <TableCell>{new Date(pet.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
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
