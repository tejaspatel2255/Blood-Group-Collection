-- Create donors table
CREATE TABLE IF NOT EXISTS public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  email TEXT,
  area TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth TEXT,
  last_donation_date TEXT,
  total_donations INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donation_records table
CREATE TABLE IF NOT EXISTS public.donation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  donation_date TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  volume INTEGER NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_donations table
CREATE TABLE IF NOT EXISTS public.scheduled_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  scheduled_date TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  location TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_donations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (allowing anyone to read/write to donors)
CREATE POLICY "Allow all users to select donors" ON public.donors FOR SELECT USING (TRUE);
CREATE POLICY "Allow all users to insert donors" ON public.donors FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow all users to update donors" ON public.donors FOR UPDATE USING (TRUE);
CREATE POLICY "Allow all users to delete donors" ON public.donors FOR DELETE USING (TRUE);

CREATE POLICY "Allow all users to select donation_records" ON public.donation_records FOR SELECT USING (TRUE);
CREATE POLICY "Allow all users to insert donation_records" ON public.donation_records FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow all users to update donation_records" ON public.donation_records FOR UPDATE USING (TRUE);
CREATE POLICY "Allow all users to delete donation_records" ON public.donation_records FOR DELETE USING (TRUE);

CREATE POLICY "Allow all users to select scheduled_donations" ON public.scheduled_donations FOR SELECT USING (TRUE);
CREATE POLICY "Allow all users to insert scheduled_donations" ON public.scheduled_donations FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Allow all users to update scheduled_donations" ON public.scheduled_donations FOR UPDATE USING (TRUE);
CREATE POLICY "Allow all users to delete scheduled_donations" ON public.scheduled_donations FOR DELETE USING (TRUE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON public.donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_area ON public.donors(area);
CREATE INDEX IF NOT EXISTS idx_donors_phone ON public.donors(phone_number);
CREATE INDEX IF NOT EXISTS idx_donation_records_donor_id ON public.donation_records(donor_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_donations_donor_id ON public.scheduled_donations(donor_id);
