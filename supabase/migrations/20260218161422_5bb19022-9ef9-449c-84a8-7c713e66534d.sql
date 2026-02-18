
-- Add transport fields to guests table
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS bus_ida boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS bus_vuelta boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS barco_ida boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS barco_vuelta boolean NOT NULL DEFAULT false;
