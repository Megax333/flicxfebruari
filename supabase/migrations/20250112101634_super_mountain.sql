/*
  # Add Sample Live TV Data

  1. New Data
    - Add sample channels from the existing LiveTV component
    - Add sample programs for each channel
  
  2. Changes
    - Populate tv_channels with existing sample data
    - Populate tv_programs with corresponding program data
*/

-- Insert sample channels
INSERT INTO tv_channels (name, category, icon, thumbnail, video_url, is_live)
VALUES
  (
    'Quantum Network',
    'Sci-Fi',
    'sparkles',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    true
  ),
  (
    'Global Pulse',
    'News',
    'globe',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=1920&h=1080&fit=crop',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    false
  ),
  (
    'Culinary Network',
    'Cooking',
    'film',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&h=1080&fit=crop',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    false
  ),
  (
    'Cartoon Central',
    'Animation',
    'film',
    'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=1920&h=1080&fit=crop',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    true
  ),
  (
    'News 24/7',
    'News',
    'tv',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=1920&h=1080&fit=crop',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    false
  );

-- Insert sample programs
INSERT INTO tv_programs (channel_id, title, description, start_time, end_time)
SELECT
  id as channel_id,
  'The Last Frontier' as title,
  'Experience the untold story of humanity''s greatest adventure' as description,
  NOW() - INTERVAL '30 minutes' as start_time,
  NOW() + INTERVAL '60 minutes' as end_time
FROM tv_channels
WHERE name = 'Quantum Network'
UNION ALL
SELECT
  id as channel_id,
  'Digital Horizons' as title,
  'Explore the boundaries of virtual reality' as description,
  NOW() + INTERVAL '60 minutes' as start_time,
  NOW() + INTERVAL '180 minutes' as end_time
FROM tv_channels
WHERE name = 'Quantum Network'
UNION ALL
SELECT
  id as channel_id,
  'Tech Today' as title,
  'Latest technology news and updates' as description,
  NOW() - INTERVAL '15 minutes' as start_time,
  NOW() + INTERVAL '45 minutes' as end_time
FROM tv_channels
WHERE name = 'Global Pulse'
UNION ALL
SELECT
  id as channel_id,
  'Future Focus' as title,
  'Looking ahead at emerging technologies' as description,
  NOW() + INTERVAL '45 minutes' as start_time,
  NOW() + INTERVAL '105 minutes' as end_time
FROM tv_channels
WHERE name = 'Global Pulse';