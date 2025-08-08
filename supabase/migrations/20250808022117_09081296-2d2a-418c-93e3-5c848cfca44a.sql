-- Fix RLS policies to properly check profiles.role instead of PostgreSQL roles

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can view all pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can insert pets for any owner" ON public.pets;

-- Create correct admin policies for appointments
CREATE POLICY "Admins can view all appointments"
ON public.appointments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update all appointments"
ON public.appointments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete all appointments"
ON public.appointments
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create correct admin policies for pets
CREATE POLICY "Admins can view all pets"
ON public.pets
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update all pets"
ON public.pets
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete all pets"
ON public.pets
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert pets for any owner"
ON public.pets
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create admin policies for profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS admin_check
    WHERE admin_check.id = auth.uid() 
    AND admin_check.role = 'admin'
  )
);

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS admin_check
    WHERE admin_check.id = auth.uid() 
    AND admin_check.role = 'admin'
  )
);