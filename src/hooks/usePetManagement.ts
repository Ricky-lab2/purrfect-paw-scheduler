
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pet, Appointment, User } from "@/types/auth";

export const usePetManagement = (user: User | null) => {
  const getUserPets = useCallback(async (): Promise<Pet[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching pets:', error);
        return [];
      }

      return (data || []).map(pet => ({
        id: pet.id,
        name: pet.name,
        type: pet.type as Pet['type'],
        species: pet.species,
        breed: pet.breed,
        weight: pet.weight,
        birthDate: pet.birth_date,
        gender: pet.gender as Pet['gender'],
        ownerId: pet.owner_id
      }));
    } catch (error) {
      console.error('Error fetching pets:', error);
      return [];
    }
  }, [user?.id]);

  const addPet = useCallback(async (pet: Omit<Pet, 'id' | 'ownerId'>): Promise<Pet> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('pets')
      .insert({
        owner_id: user.id,
        name: pet.name,
        type: pet.type,
        species: pet.species,
        breed: pet.breed,
        weight: pet.weight,
        birth_date: pet.birthDate,
        gender: pet.gender,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding pet:', error);
      throw new Error("Failed to add pet");
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type as Pet['type'],
      species: data.species,
      breed: data.breed,
      weight: data.weight,
      birthDate: data.birth_date,
      gender: data.gender as Pet['gender'],
      ownerId: data.owner_id
    };
  }, [user?.id]);

  const updatePet = useCallback(async (id: string, updates: Partial<Omit<Pet, 'id' | 'ownerId'>>): Promise<boolean> => {
    if (!user) return false;

    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.species) dbUpdates.species = updates.species;
    if (updates.breed !== undefined) dbUpdates.breed = updates.breed;
    if (updates.weight !== undefined) dbUpdates.weight = updates.weight;
    if (updates.birthDate) dbUpdates.birth_date = updates.birthDate;
    if (updates.gender) dbUpdates.gender = updates.gender;

    const { error } = await supabase
      .from('pets')
      .update(dbUpdates)
      .eq('id', id)
      .eq('owner_id', user.id);

    return !error;
  }, [user?.id]);

  const deletePet = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);

    return !error;
  }, [user?.id]);

  const getPetById = useCallback(async (id: string): Promise<Pet | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      type: data.type as Pet['type'],
      species: data.species,
      breed: data.breed,
      weight: data.weight,
      birthDate: data.birth_date,
      gender: data.gender as Pet['gender'],
      ownerId: data.owner_id
    };
  }, [user?.id]);

  const calculatePetAge = useCallback((birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    let remainingMonths = months;
    if (remainingMonths < 0) {
      remainingMonths += 12;
    }
    
    if (years < 1) {
      return remainingMonths === 1 ? "1 month" : `${remainingMonths} months`;
    } else if (remainingMonths === 0) {
      return years === 1 ? "1 year" : `${years} years`;
    } else {
      return `${years} ${years === 1 ? "year" : "years"} and ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
    }
  }, []);

  const getUserAppointments = useCallback(async (): Promise<Appointment[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      return (data || []).map(apt => ({
        id: apt.id,
        petName: apt.pet_name,
        service: apt.service,
        date: apt.appointment_date,
        timeSlot: apt.time_slot,
        ownerName: apt.owner_name,
        ownerId: apt.owner_id
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }, [user?.id]);

  return {
    getUserPets,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    calculatePetAge,
    getUserAppointments
  };
};
