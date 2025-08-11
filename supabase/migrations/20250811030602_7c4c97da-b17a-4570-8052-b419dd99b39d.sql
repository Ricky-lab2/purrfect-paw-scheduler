-- Fix infinite recursion in RLS policies by creating a security definer function
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Only admins can view admin records" ON public.admins;
DROP POLICY IF EXISTS "Only admins can insert admin records" ON public.admins;
DROP POLICY IF EXISTS "Only admins can update admin records" ON public.admins;
DROP POLICY IF EXISTS "Only admins can delete admin records" ON public.admins;

-- Update the existing function to actually check the role properly
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    user_role text;
BEGIN
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = auth.uid();
    
    RETURN COALESCE(user_role, 'customer');
END;
$$;

-- Create simple RLS policies using the security definer function
CREATE POLICY "Only admins can view admin records" ON public.admins
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can insert admin records" ON public.admins
FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can update admin records" ON public.admins
FOR UPDATE USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can delete admin records" ON public.admins
FOR DELETE USING (public.get_current_user_role() = 'admin');