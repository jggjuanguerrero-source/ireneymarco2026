DROP POLICY "Allow read from authenticated or anon" ON public.rsvp_events;
CREATE POLICY "Deny public read" ON public.rsvp_events FOR SELECT USING (false);