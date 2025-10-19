-- Create feedback table for anonymous appreciation and feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woman_id UUID NOT NULL REFERENCES public.women_profiles(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL, -- 'appreciation' or 'feedback'
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for submitting feedback)
CREATE POLICY "Allow public insert to feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

-- Allow admin read access (we'll handle this in the app)
CREATE POLICY "Allow public read access to feedback"
  ON public.feedback FOR SELECT
  USING (true);
