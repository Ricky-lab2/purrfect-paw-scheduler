-- Enable real-time functionality for appointments table
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- Enable real-time functionality for pets table
ALTER TABLE public.pets REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pets;

-- Enable real-time functionality for profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;