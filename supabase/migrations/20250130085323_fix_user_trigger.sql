-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create updated function with explicit column references
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'username')::text,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://ui-avatars.com/api/?background=random&name=' || (NEW.raw_user_meta_data->>'username'))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add explicit policy for profile creation
DROP POLICY IF EXISTS "System can create user profiles" ON profiles;
CREATE POLICY "System can create user profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);
