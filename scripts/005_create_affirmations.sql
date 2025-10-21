-- Create affirmations table
CREATE TABLE IF NOT EXISTS affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woman_id UUID NOT NULL REFERENCES women_profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on woman_id for faster queries
CREATE INDEX IF NOT EXISTS idx_affirmations_woman_id ON affirmations(woman_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_affirmations_created_at ON affirmations(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE affirmations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read affirmations (public)
CREATE POLICY "Allow public read affirmations"
  ON affirmations FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert affirmations
CREATE POLICY "Allow public insert affirmations"
  ON affirmations FOR INSERT
  WITH CHECK (true);
