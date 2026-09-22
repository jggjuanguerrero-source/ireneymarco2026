CREATE TABLE public.preboda_rsvp (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  attending boolean NOT NULL,
  guest_count integer NOT NULL DEFAULT 0,
  allergies text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.preboda_rsvp TO anon, authenticated;
GRANT ALL ON public.preboda_rsvp TO service_role;

ALTER TABLE public.preboda_rsvp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for preboda rsvp"
ON public.preboda_rsvp FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Deny public read"
ON public.preboda_rsvp FOR SELECT
TO anon, authenticated
USING (false);