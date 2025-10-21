-- Migration: Add phuc_long_image to women_profiles table
-- This stores each woman's unique gift card image URL

-- Drop the old phuc_long_code column from redemptions if it exists
ALTER TABLE public.redemptions 
  DROP COLUMN IF EXISTS phuc_long_code;

-- Add phuc_long_image column to women_profiles table
ALTER TABLE public.women_profiles 
  ADD COLUMN IF NOT EXISTS phuc_long_image TEXT;

-- Now you can update each woman with their Supabase Storage URL:
-- UPDATE public.women_profiles 
-- SET phuc_long_image = 'https://your-project.supabase.co/storage/v1/object/public/gift-cards/hao.png' 
-- WHERE name = 'Hao';

-- UPDATE public.women_profiles 
-- SET phuc_long_image = 'https://your-project.supabase.co/storage/v1/object/public/gift-cards/nhu.png' 
-- WHERE name = 'Nhu';

-- UPDATE public.women_profiles 
-- SET phuc_long_image = 'https://your-project.supabase.co/storage/v1/object/public/gift-cards/meg.png' 
-- WHERE name LIKE '%Meg%';
