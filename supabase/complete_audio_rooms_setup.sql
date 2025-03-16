-- PART 1: USER PROFILES SETUP
-- Check if user_profiles table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id)
);

-- Create RLS policies for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.user_profiles;
CREATE POLICY "Anyone can view profiles"
    ON public.user_profiles
    FOR SELECT
    USING (true);

-- Users can update their own profiles
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.user_profiles;
CREATE POLICY "Users can update their own profiles"
    ON public.user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can insert their own profiles
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.user_profiles;
CREATE POLICY "Users can insert their own profiles"
    ON public.user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, username, avatar_url)
    VALUES (NEW.id, NEW.email, 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- PART 2: AUDIO ROOMS SETUP
-- Create audio_rooms table
DROP TABLE IF EXISTS public.audio_room_participants;
DROP TABLE IF EXISTS public.audio_rooms;

CREATE TABLE IF NOT EXISTS public.audio_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create audio_room_participants table to track who is in which room
CREATE TABLE IF NOT EXISTS public.audio_room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.audio_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(room_id, user_id)
);

-- Create RLS policies for audio_rooms
ALTER TABLE public.audio_rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view audio rooms" ON public.audio_rooms;
CREATE POLICY "Anyone can view audio rooms"
    ON public.audio_rooms
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create audio rooms" ON public.audio_rooms;
CREATE POLICY "Authenticated users can create audio rooms"
    ON public.audio_rooms
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Room hosts can update their rooms" ON public.audio_rooms;
CREATE POLICY "Room hosts can update their rooms"
    ON public.audio_rooms
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = host_id)
    WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Room hosts can delete their rooms" ON public.audio_rooms;
CREATE POLICY "Room hosts can delete their rooms"
    ON public.audio_rooms
    FOR DELETE
    TO authenticated
    USING (auth.uid() = host_id);

-- Create RLS policies for audio_room_participants
ALTER TABLE public.audio_room_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view room participants" ON public.audio_room_participants;
CREATE POLICY "Anyone can view room participants"
    ON public.audio_room_participants
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can join rooms" ON public.audio_room_participants;
CREATE POLICY "Authenticated users can join rooms"
    ON public.audio_room_participants
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave rooms" ON public.audio_room_participants;
CREATE POLICY "Users can leave rooms"
    ON public.audio_room_participants
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create function to get room participants
CREATE OR REPLACE FUNCTION public.get_room_participants(room_id UUID)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    avatar_url TEXT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT
        p.user_id,
        profiles.username,
        profiles.avatar_url
    FROM
        public.audio_room_participants p
    JOIN
        public.user_profiles profiles ON p.user_id = profiles.user_id
    WHERE
        p.room_id = room_id;
$$;

-- Function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger for audio_rooms
DROP TRIGGER IF EXISTS set_updated_at_timestamp ON public.audio_rooms;
CREATE TRIGGER set_updated_at_timestamp
BEFORE UPDATE ON public.audio_rooms
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

-- PART 3: ENABLE REALTIME
-- Enable realtime for all the tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audio_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audio_room_participants;
