-- Drop the existing view
DROP VIEW IF EXISTS public.community_posts_with_authors;

-- Recreate the view with proper joins to user_profiles
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
LEFT JOIN 
    public.user_profiles up ON p.user_id = up.user_id;
