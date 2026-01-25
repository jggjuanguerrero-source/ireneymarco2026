-- Add children_count column
ALTER TABLE public.guests
ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0;

-- Add children_needs column
ALTER TABLE public.guests
ADD COLUMN IF NOT EXISTS children_needs TEXT;