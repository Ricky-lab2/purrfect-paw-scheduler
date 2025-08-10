-- Fix RLS policies to use consistent admin check via profiles.role
-- Update profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  OR auth.uid() = id
);

-- Update appointments policies  
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
CREATE POLICY "Admins can view all appointments" ON public.appointments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  OR auth.uid() = owner_id
);

DROP POLICY IF EXISTS "Admins can update all appointments" ON public.appointments;
CREATE POLICY "Admins can update all appointments" ON public.appointments
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  OR auth.uid() = owner_id
);

DROP POLICY IF EXISTS "Admins can delete all appointments" ON public.appointments;
CREATE POLICY "Admins can delete all appointments" ON public.appointments
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  OR auth.uid() = owner_id
);

-- Update pets policies
DROP POLICY IF EXISTS "Admins can view all pets" ON public.pets;
CREATE POLICY "Admins can view all pets" ON public.pets
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  OR auth.uid() = owner_id
);

DROP POLICY IF EXISTS "Admins can update all pets" ON public.pets;
CREATE POLICY "Admins can update all pets" ON public.pets
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  OR auth.uid() = owner_id
);

DROP POLICY IF EXISTS "Admins can delete all pets" ON public.pets;
CREATE POLICY "Admins can delete all pets" ON public.pets
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  OR auth.uid() = owner_id
);

DROP POLICY IF EXISTS "Admins can insert pets for any owner" ON public.pets;
CREATE POLICY "Admins can insert pets for any owner" ON public.pets
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  OR auth.uid() = owner_id
);