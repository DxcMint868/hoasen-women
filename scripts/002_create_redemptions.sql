-- Create redemptions table to track redemption status
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

-- Allow public read access (needed for redemption page)
CREATE POLICY "Allow public read access to redemptions"
  ON public.redemptions FOR SELECT
  USING (true);

-- Allow public insert (for claiming rewards)
CREATE POLICY "Allow public insert to redemptions"
  ON public.redemptions FOR INSERT
  WITH CHECK (true);

-- Allow public update (for updating wallet and claim status)
CREATE POLICY "Allow public update to redemptions"
  ON public.redemptions FOR UPDATE
  USING (true);

-- Create initial redemption records for each woman
INSERT INTO public.redemptions (woman_id)
SELECT id FROM public.women_profiles
ON CONFLICT DO NOTHING;
