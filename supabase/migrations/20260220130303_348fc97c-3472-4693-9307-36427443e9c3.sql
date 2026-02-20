CREATE POLICY "Allow public delete for guests"
ON public.guests
FOR DELETE
USING (true);