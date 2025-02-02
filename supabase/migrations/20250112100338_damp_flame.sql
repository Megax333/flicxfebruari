/*
  # Add Live TV Tables

  1. New Tables
    - `tv_channels`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `icon` (text)
      - `thumbnail` (text)
      - `video_url` (text)
      - `is_live` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `tv_programs`
      - `id` (uuid, primary key)
      - `channel_id` (uuid, references tv_channels)
      - `title` (text)
      - `description` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create tv_channels table
CREATE TABLE IF NOT EXISTS tv_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL,
  thumbnail text NOT NULL,
  video_url text NOT NULL,
  is_live boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tv_programs table
CREATE TABLE IF NOT EXISTS tv_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES tv_channels(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tv_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_programs ENABLE ROW LEVEL SECURITY;

-- Channels policies
CREATE POLICY "Channels are viewable by everyone"
  ON tv_channels FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert channels"
  ON tv_channels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can update channels"
  ON tv_channels FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can delete channels"
  ON tv_channels FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

-- Programs policies
CREATE POLICY "Programs are viewable by everyone"
  ON tv_programs FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert programs"
  ON tv_programs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can update programs"
  ON tv_programs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can delete programs"
  ON tv_programs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );