-- Create posts table for community
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    audio_url TEXT,
    post_type TEXT,
    tribe TEXT,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the posts table
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for the posts table
CREATE POLICY "Anyone can read posts" 
ON public.community_posts 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own posts" 
ON public.community_posts 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create a view that joins posts with user profiles for easy fetching
CREATE OR REPLACE VIEW public.community_posts_with_authors AS
SELECT 
    p.id,
    p.content,
    p.media_url,
    p.audio_url,
    p.post_type,
    p.tribe,
    p.likes,
    p.comments,
    p.shares,
    p.created_at,
    p.updated_at,
    p.user_id,
    up.username as author_handle,
    up.full_name as author_name,
    up.avatar_url as author_avatar
FROM 
    public.community_posts p
JOIN 
    public.user_profiles up ON p.user_id = up.user_id;
