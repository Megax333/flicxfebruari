/*
  # Update user profile to admin

  1. Changes
    - Updates the profile for Silusley to have admin privileges
*/

UPDATE profiles 
SET username = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'celflicks@gmail.com');