CREATE TABLE public.hotel_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  people_count integer NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hotel_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.hotel_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON public.hotel_requests
  FOR SELECT USING (true);