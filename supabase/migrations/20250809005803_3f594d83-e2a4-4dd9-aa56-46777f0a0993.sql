-- Enable RLS on all tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create admin role policies for appointments
CREATE POLICY "Admins can view all appointments" 
ON public.appointments 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
TO authenticated 
USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own appointments" 
ON public.appointments 
FOR INSERT 
TO authenticated 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
TO authenticated 
USING (owner_id = auth.uid());

CREATE POLICY "Admins can update all appointments" 
ON public.appointments 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Create admin role policies for pets
CREATE POLICY "Admins can view all pets" 
ON public.pets 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Users can view their own pets" 
ON public.pets 
FOR SELECT 
TO authenticated 
USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own pets" 
ON public.pets 
FOR INSERT 
TO authenticated 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own pets" 
ON public.pets 
FOR UPDATE 
TO authenticated 
USING (owner_id = auth.uid());

-- Create admin role policies for profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());