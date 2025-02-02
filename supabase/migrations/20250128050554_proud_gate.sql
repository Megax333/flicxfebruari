/*
  # Fix Profile Bio and Updates

  1. Changes
    - Add missing bio column
    - Add followers/following count columns
    - Update RLS policies
    - Add function to update profile
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add bio column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;

  -- Add followers/following count columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'followers_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN followers_count int DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'following_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN following_count int DEFAULT 0;
  END IF;
END $$;

-- Create function to safely update profile
CREATE OR REPLACE FUNCTION update_profile(
  user_id uuid,
  new_avatar_url text DEFAULT NULL,
  new_bio text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    avatar_url = COALESCE(new_avatar_url, avatar_url),
    bio = COALESCE(new_bio, bio),
    updated_at = now()
  WHERE id = user_id;

  RETURN FOUND;
END;
$$;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_bio ON profiles USING gin(to_tsvector('english', COALESCE(bio, '')));
CREATE INDEX IF NOT EXISTS idx_profiles_followers ON profiles(followers_count);
CREATE INDEX IF NOT EXISTS idx_profiles_following ON profiles(following_count);