-- ============================================
-- Hoasen Women's Day Gift Redemption Database Setup
-- ============================================

-- 1. Create women_profiles table
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

-- 2. Create redemptions table
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woman_id UUID NOT NULL REFERENCES public.women_profiles(id) ON DELETE CASCADE,
  wallet_address TEXT,
  phuc_long_code TEXT NOT NULL DEFAULT 'PHUCLONG-' || gen_random_uuid()::TEXT,
  usdt_claimed BOOLEAN DEFAULT FALSE,
  nft_claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to redemptions"
  ON public.redemptions FOR SELECT
  USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert to redemptions"
  ON public.redemptions FOR INSERT
  WITH CHECK (true);

-- Allow public update
CREATE POLICY "Allow public update to redemptions"
  ON public.redemptions FOR UPDATE
  USING (true);

-- 3. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woman_id UUID NOT NULL REFERENCES public.women_profiles(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'personal',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to messages"
  ON public.messages FOR SELECT
  USING (true);

-- 4. Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woman_id UUID NOT NULL REFERENCES public.women_profiles(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert to feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

-- Allow public read access
CREATE POLICY "Allow public read access to feedback"
  ON public.feedback FOR SELECT
  USING (true);

-- ============================================
-- Insert Initial Data
-- ============================================

-- Insert women profiles
INSERT INTO public.women_profiles (name, slack_pfp_url, password_hash)
VALUES 
  ('Meg Chanta', '/images/meg-pfp.jpg', '$2b$10$placeholder_meg_hash'),
  ('Hao Vo', '/images/hao-pfp.jpg', '$2b$10$placeholder_hao_hash'),
  ('Nhu Nguyen', '/images/nhu-pfp.jpg', '$2b$10$placeholder_nhu_hash')
ON CONFLICT DO NOTHING;

-- Create redemption records for each woman
INSERT INTO public.redemptions (woman_id)
SELECT id FROM public.women_profiles
WHERE id NOT IN (SELECT woman_id FROM public.redemptions);

-- Insert personalized messages
INSERT INTO public.messages (woman_id, message_type, content)
SELECT 
  id,
  'personal',
  CASE name
    WHEN 'Meg Chanta' THEN 'Dear Meg, Thank you for your incredible contributions to Hoasen. Your creativity and dedication inspire us all. Happy Women''s Day!'
    WHEN 'Hao Vo' THEN 'Dear Hao, Your technical excellence and collaborative spirit make Hoasen stronger every day. We celebrate you today and always. Happy Women''s Day!'
    WHEN 'Nhu Nguyen' THEN 'Dear Nhu, Your passion for innovation and commitment to our mission is truly remarkable. Thank you for being part of our journey. Happy Women''s Day!'
  END
FROM public.women_profiles
WHERE id NOT IN (SELECT woman_id FROM public.messages);
