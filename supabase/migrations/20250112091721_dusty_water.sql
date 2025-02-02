/*
  # Add Categories Table
  
  1. New Tables
    - `categories`
      - `id` (text, primary key)
      - `name` (text)
      - `glow` (text)
      - `order` (integer)
  
  2. Security
    - Enable RLS on categories table
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  glow text,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND username IN ('admin')
    )
  );

-- Insert default categories
INSERT INTO categories (id, name, "order", glow) VALUES
  ('home', 'Home', 0, null),
  ('livetv', 'LiveTV', 1, null),
  ('library', 'Library', 2, null),
  ('fundraisers', 'Sponsorships', 3, null),
  ('promo', 'Promo Stream', 4, null),
  ('counseling', 'Counseling', 5, null),
  ('gaming', 'Gaming', 6, null),
  ('people', 'People & Blogs', 7, null),
  ('comedy', 'Comedy', 8, null),
  ('entertainment', 'Entertainment', 9, null);