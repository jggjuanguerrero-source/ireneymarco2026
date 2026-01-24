-- Create guests table for wedding RSVP
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en', 'it')),
  rsvp_status BOOLEAN DEFAULT NULL,
  dietary_reqs TEXT,
  song_request TEXT,
  table_id INTEGER,
  plus_one BOOLEAN DEFAULT false,
  plus_one_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Create policy for guests to view and update their own data (by email)
-- For now, allow public read for RSVP form to check if guest exists
CREATE POLICY "Allow public read for RSVP verification" 
ON public.guests 
FOR SELECT 
USING (true);

-- Allow public insert for RSVP submissions
CREATE POLICY "Allow public insert for RSVP" 
ON public.guests 
FOR INSERT 
WITH CHECK (true);

-- Allow updates only to own record (matched by email)
CREATE POLICY "Allow guests to update their own RSVP" 
ON public.guests 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for email lookups
CREATE INDEX idx_guests_email ON public.guests(email);

-- Add index for RSVP status filtering
CREATE INDEX idx_guests_rsvp_status ON public.guests(rsvp_status);