-- Update the admin user's role to ensure it's set correctly
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com' AND id = 'fcf4c036-1fac-43fb-87d0-9e0936a74f28';