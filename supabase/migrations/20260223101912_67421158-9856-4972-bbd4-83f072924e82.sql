CREATE TABLE public.rsvp_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL,
  guest_email TEXT,
  guest_name TEXT,
  rsvp_status BOOLEAN,
  metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.rsvp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert from service role" ON public.rsvp_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read from authenticated or anon" ON public.rsvp_events
  FOR SELECT USING (true);