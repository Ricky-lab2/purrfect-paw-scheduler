
-- Update the admin user's role to 'admin' in the profiles table
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';

-- If the profile doesn't exist yet, insert it with admin role
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', 'Admin User'),
  au.email,
  'admin'
FROM auth.users au
WHERE au.email = 'admin@example.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
);
