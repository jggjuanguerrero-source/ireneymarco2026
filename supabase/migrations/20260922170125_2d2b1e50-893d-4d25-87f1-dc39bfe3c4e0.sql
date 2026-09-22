DROP POLICY IF EXISTS "Deny public read" ON public.preboda_rsvp;
DROP POLICY IF EXISTS "No public read of preboda rsvp" ON public.preboda_rsvp;
DROP POLICY IF EXISTS "Deny public read of preboda_rsvp" ON public.preboda_rsvp;

GRANT SELECT ON public.preboda_rsvp TO anon, authenticated;

CREATE POLICY "Allow public read for admin panel"
ON public.preboda_rsvp
FOR SELECT
USING (true);