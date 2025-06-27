
-- Fix the profiles table RLS policies to avoid infinite recursion
-- First, let's drop any existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Enable read access for own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Also ensure the pets table policies are correct and don't cause recursion
DROP POLICY IF EXISTS "Users can view their own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can create their own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can update their own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can delete their own pets" ON public.pets;

-- Recreate pets policies with proper structure
CREATE POLICY "Enable read access for own pets" ON public.pets
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Enable insert for own pets" ON public.pets
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Enable update for own pets" ON public.pets
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Enable delete for own pets" ON public.pets
    FOR DELETE USING (auth.uid() = owner_id);

-- Ensure appointments table has proper policies too
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;

CREATE POLICY "Enable read access for own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Enable insert for own appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Enable update for own appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Enable delete for own appointments" ON public.appointments
    FOR DELETE USING (auth.uid() = owner_id);
