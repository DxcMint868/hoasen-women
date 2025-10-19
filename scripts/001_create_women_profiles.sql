-- Create women_profiles table
CREATE TABLE IF NOT EXISTS public.women_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slack_pfp_url TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.women_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profiles (needed for landing page)
CREATE POLICY "Allow public read access to women_profiles"
  ON public.women_profiles FOR SELECT
  USING (true);

-- Insert the three women with auto-generated passwords
-- Passwords: Meg_2024!, Hao_2024!, Nhu_2024! (you can update these)
INSERT INTO public.women_profiles (name, slack_pfp_url, password_hash)
VALUES 
  ('Meg Chanta', '/images/meg-pfp.jpg', '$2b$10$placeholder_meg_hash'),
  ('Hao Vo', '/images/hao-pfp.jpg', '$2b$10$placeholder_hao_hash'),
  ('Nhu Nguyen', '/images/nhu-pfp.jpg', '$2b$10$placeholder_nhu_hash')
ON CONFLICT DO NOTHING;
