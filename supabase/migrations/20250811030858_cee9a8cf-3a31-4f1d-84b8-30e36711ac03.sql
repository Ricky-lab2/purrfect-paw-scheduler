-- Fix critical security issues

-- Enable RLS on profiles table (ERROR: RLS Disabled in Public)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Fix search path security for existing functions (WARN: Function Search Path Mutable)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    'customer'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_user_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Explicitly set a strict, empty search path to prevent schema-related vulnerabilities
    SET search_path TO '';
    
    -- Function logic would go here if needed
    
    RETURN NEW;
END;
$$;

-- Clean up redundant RLS policies on profiles (remove duplicates)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create clean, comprehensive RLS policies for profiles
CREATE POLICY "Enable read access for own profile"
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Enable insert access for own profile"
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update access for own profile"
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admin read access to all profiles"
ON public.profiles FOR SELECT 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Admin update access to all profiles"
ON public.profiles FOR UPDATE 
USING (get_current_user_role() = 'admin');