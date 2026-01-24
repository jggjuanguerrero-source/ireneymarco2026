-- Add song_processed column to track DJ workflow
ALTER TABLE public.guests
ADD COLUMN song_processed boolean NOT NULL DEFAULT false;