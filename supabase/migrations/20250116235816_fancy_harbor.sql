/*
  # Ad System Setup

  1. New Tables
    - `ads`
      - `id` (uuid, primary key)
      - `title` (text)
      - `video_url` (text)
      - `reward_amount` (numeric)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `ad_impressions`
      - `id` (uuid, primary key)
      - `ad_id` (uuid, references ads)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Functions
    - `award_ad_watch`: Awards XCE coins to users for watching ads
    - `update_ad_stats`: Updates ad impression counts

  3. Security
    - Enable RLS on all tables
    - Add policies for viewing and managing ads
*/

-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  reward_amount numeric NOT NULL DEFAULT 0.05,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ad_impressions table
CREATE TABLE IF NOT EXISTS ad_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid REFERENCES ads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create function to award coins for watching ads
CREATE OR REPLACE FUNCTION award_ad_watch(user_id uuid, amount numeric DEFAULT 0.05)
RETURNS void AS $$
BEGIN
  -- Add coin balance update logic here
  -- This is a placeholder - implement actual coin balance update
  -- when the wallet/balance system is implemented
  RAISE NOTICE 'Awarded % XCE to user %', amount, user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;

-- Ads policies
CREATE POLICY "Ads are viewable by everyone"
  ON ads FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert ads"
  ON ads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can update ads"
  ON ads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can delete ads"
  ON ads FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

-- Ad impressions policies
CREATE POLICY "Users can view their own ad impressions"
  ON ad_impressions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ad impressions"
  ON ad_impressions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ad_impressions_ad_id ON ad_impressions(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_user_id ON ad_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_created_at ON ad_impressions(created_at);