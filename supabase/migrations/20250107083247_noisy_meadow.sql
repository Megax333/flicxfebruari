/*
  # Fix movies table schema

  1. Changes
    - Rename preview_url to preview to match application code
    - Add NOT NULL constraints to required fields
*/

ALTER TABLE movies 
  RENAME COLUMN preview_url TO preview;

ALTER TABLE movies
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN thumbnail SET NOT NULL,
  ALTER COLUMN preview SET NOT NULL,
  ALTER COLUMN "order" SET NOT NULL;