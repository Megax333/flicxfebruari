/*
  # Add initial movies

  1. New Data
    - Adds initial movies to the movies table
    - Sets up thumbnails and preview URLs
*/

INSERT INTO movies (title, description, thumbnail, preview_url, tags, "order")
VALUES
  (
    'The Last Frontier',
    'Experience the untold story of humanity''s greatest adventure.',
    'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?w=300&h=400&fit=crop',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ARRAY['#mmo', '#co-op', '#anime', '#adventure', '#rpg'],
    0
  ),
  (
    'Digital Horizons',
    'Explore the boundaries of virtual reality in this groundbreaking series.',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=400&fit=crop',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ARRAY['#rpg', '#action', '#fantasy', '#adventure'],
    1
  );