-- Check current policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Check table structure
\d+ profiles;

-- Check existing triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_schema,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND event_object_schema = 'auth';
