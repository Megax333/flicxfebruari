/*
  # Fix ad impressions RLS policies

  1. Changes
    - Drop existing RLS policies for ad_impressions
    - Add new policies that properly handle authenticated users
    - Add policy for admins to view all impressions
  
  2. Security
    - Enable RLS
    - Add proper policies for authenticated users
    - Add admin access policy
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own ad impressions" ON ad_impressions;
DROP POLICY IF EXISTS "Users can insert their own ad impressions" ON ad_impressions;

-- Create new policies
CREATE POLICY "Users can view their own ad impressions"
  ON ad_impressions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert ad impressions"
  ON ad_impressions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ad impressions"
  ON ad_impressions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND username = 'admin'
    )
  );