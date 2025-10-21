-- Add 'flowers' column to affirmations table for denormalized flower data
ALTER TABLE affirmations
ADD COLUMN flowers TEXT;

-- Example usage:
-- flowers = 'rose|2,tulip|3,daisy|2'
