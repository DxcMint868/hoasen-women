-- Create messages table for personal company messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woman_id UUID NOT NULL REFERENCES public.women_profiles(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'personal', -- 'personal' or 'company'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to messages"
  ON public.messages FOR SELECT
  USING (true);

-- Insert personalized messages for each woman
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
ON CONFLICT DO NOTHING;
