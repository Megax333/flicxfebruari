/*
  # Add Episodes Support
  
  1. New Tables
    - `episodes`
      - `id` (uuid, primary key)
      - `movie_id` (uuid, foreign key to movies)
      - `number` (integer)
      - `title` (text)
      - `video_url` (text)
      - `duration` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on episodes table
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  number integer NOT NULL,
  title text NOT NULL,
  video_url text NOT NULL,
  duration text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Episodes are viewable by everyone"
  ON episodes FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert episodes"
  ON episodes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can update episodes"
  ON episodes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can delete episodes"
  ON episodes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );