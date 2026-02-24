/*
  # Fix Function Search Path Security Issue

  1. Security Fix
    - Drop the trigger first to remove dependency on the function
    - Drop and recreate the update_updated_at_column function with secure search_path
    - Recreate the trigger with the updated function
    - This prevents potential security vulnerabilities from search_path manipulation

  2. Function Details
    - Sets search_path to 'public' explicitly for security
    - Maintains the same functionality for updating updated_at timestamps
    - Uses SECURITY DEFINER with restricted search_path for safety
*/

-- Drop the trigger first to remove dependency on the function
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Recreate the function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger with the updated function
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();