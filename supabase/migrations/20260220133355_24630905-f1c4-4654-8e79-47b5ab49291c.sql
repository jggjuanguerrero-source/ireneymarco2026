
-- Create a trigger function that calls the send-confirmation edge function via pg_net
CREATE OR REPLACE FUNCTION public.notify_guest_confirmation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  edge_function_url text;
  anon_key text;
  payload jsonb;
BEGIN
  edge_function_url := 'https://mqdleveeplrqsubffodd.supabase.co/functions/v1/send-confirmation';
  anon_key := current_setting('app.settings.supabase_anon_key', true);
  
  -- If anon_key not available via app settings, use the known key
  IF anon_key IS NULL OR anon_key = '' THEN
    anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZGxldmVlcGxycXN1YmZmb2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzI4NTYsImV4cCI6MjA4NDg0ODg1Nn0.q3ygPAzNYrhhzCJJJ4u9iynFkBoDHxAj8iwGvLh3wx0';
  END IF;

  payload := jsonb_build_object('record', row_to_json(NEW));

  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key,
      'apikey', anon_key
    ),
    body := payload
  );

  RETURN NEW;
END;
$$;

-- Create trigger on guests table for new inserts
CREATE TRIGGER on_guest_insert_send_confirmation
AFTER INSERT ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.notify_guest_confirmation();
