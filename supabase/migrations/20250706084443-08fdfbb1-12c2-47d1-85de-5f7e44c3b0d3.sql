
-- First, let's create a security definer function to get the current user's role
-- This will break the infinite recursion cycle
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Enable read access for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new non-recursive policies for profiles
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Also fix the pets policies to ensure they work correctly
DROP POLICY IF EXISTS "Enable read access for own pets" ON public.pets;
DROP POLICY IF EXISTS "Enable insert for own pets" ON public.pets;
DROP POLICY IF EXISTS "Enable update for own pets" ON public.pets;
DROP POLICY IF EXISTS "Enable delete for own pets" ON public.pets;

CREATE POLICY "Users can read own pets" ON public.pets
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own pets" ON public.pets
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own pets" ON public.pets
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own pets" ON public.pets
    FOR DELETE USING (auth.uid() = owner_id);
