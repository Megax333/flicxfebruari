/*
  # Add Bio Column to Profiles Table

  1. Changes
    - Add bio column to profiles table
    - Update RLS policies to allow bio updates
    - Add index for bio search
*/

-- Add bio column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
END $$;

-- Update RLS policies to include bio
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add index for bio search
CREATE INDEX IF NOT EXISTS idx_profiles_bio ON profiles USING gin(to_tsvector('english', COALESCE(bio, '')));