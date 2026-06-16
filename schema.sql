-- Disable notices
SET client_min_messages = warning;

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'player', -- 'player', 'organizer', 'owner'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  location TEXT,
  price_per_hour NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  prize_pool NUMERIC DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);
  
CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for venues
CREATE POLICY "Venues are viewable by everyone." 
  ON public.venues FOR SELECT USING (true);

CREATE POLICY "Owners can insert their venues." 
  ON public.venues FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their venues." 
  ON public.venues FOR UPDATE USING (auth.uid() = owner_id);

-- Policies for tournaments
CREATE POLICY "Tournaments are viewable by everyone." 
  ON public.tournaments FOR SELECT USING (true);

CREATE POLICY "Organizers can insert their tournaments." 
  ON public.tournaments FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their tournaments." 
  ON public.tournaments FOR UPDATE USING (auth.uid() = organizer_id);
