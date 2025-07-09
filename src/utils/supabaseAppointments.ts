
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseAppointment {
  id?: string;
  owner_id: string;
  pet_name: string;
  service: string;
  appointment_date: string;
  time_slot: string;
  owner_name: string;
  status?: string;
}

export const saveAppointmentToSupabase = async (appointmentData: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to book appointments');
    }

    const supabaseAppointment: SupabaseAppointment = {
      owner_id: user.id,
      pet_name: appointmentData.petName,
      service: appointmentData.service,
      appointment_date: appointmentData.date,
      time_slot: appointmentData.timeSlot,
      owner_name: appointmentData.ownerName,
      status: 'scheduled'
    };

    console.log('Saving appointment to Supabase:', supabaseAppointment);

    const { data, error } = await supabase
      .from('appointments')
      .insert(supabaseAppointment)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Successfully saved appointment:', data);
    return data;
  } catch (error) {
    console.error('Error saving appointment to Supabase:', error);
    throw error;
  }
};

export const getUserAppointmentsFromSupabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('owner_id', user.id)
      .order('appointment_date', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching appointments from Supabase:', error);
    throw error;
  }
};
