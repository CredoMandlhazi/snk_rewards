
-- Tiers table (public read)
CREATE TABLE public.tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  min_points INTEGER NOT NULL DEFAULT 0,
  discount_percentage INTEGER NOT NULL DEFAULT 0,
  benefits TEXT[],
  sort_order INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tiers are public read" ON public.tiers FOR SELECT USING (true);

-- Seed tiers
INSERT INTO public.tiers (name, min_points, discount_percentage, benefits, sort_order) VALUES
  ('Bronze', 0, 5, ARRAY['5% discount on purchases', 'Birthday points bonus'], 1),
  ('Silver', 1000, 10, ARRAY['10% discount on purchases', 'Early access to sales', 'Birthday double points'], 2),
  ('Gold', 2500, 15, ARRAY['15% discount on purchases', 'Early access to sales', 'Birthday double points', 'Free shipping'], 3),
  ('VIP', 5000, 20, ARRAY['20% discount on purchases', 'Exclusive VIP events', 'Personal stylist', 'Birthday triple points', 'Free shipping'], 4);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  surname TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  profile_picture_url TEXT,
  tier_id UUID REFERENCES public.tiers(id),
  points_balance INTEGER NOT NULL DEFAULT 0,
  total_points_earned INTEGER NOT NULL DEFAULT 0,
  barcode TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stores table (public read)
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT,
  hours TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stores are public read" ON public.stores FOR SELECT USING (true);

-- Seed stores (South Africa locations)
INSERT INTO public.stores (name, address, latitude, longitude, phone, hours) VALUES
  ('SNK Showroom - Mall of Africa', 'Lone Creek Cres, Waterfall City, Midrand, 1685', -26.0167, 28.1067, '+27 10 596 1002', '09:00 - 21:00'),
  ('SNK Showroom - Sandton City', 'Rivonia Rd, Sandhurst, Sandton, 2196', -26.1076, 28.0567, '+27 11 784 0800', '09:00 - 20:00'),
  ('SNK Showroom - V&A Waterfront', '19 Dock Rd, V&A Waterfront, Cape Town, 8001', -33.9036, 18.4214, '+27 21 408 7600', '09:00 - 21:00'),
  ('SNK Showroom - Gateway Theatre', '1 Palm Blvd, Umhlanga Ridge, Durban, 4319', -29.7337, 31.0683, '+27 31 514 0500', '09:00 - 20:00');

-- Deals table (public read)
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  discount TEXT NOT NULL,
  brand TEXT,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deals are public read" ON public.deals FOR SELECT USING (true);

-- Rewards table (public read)
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  points_required INTEGER NOT NULL,
  tier_required UUID REFERENCES public.tiers(id),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rewards are public read" ON public.rewards FOR SELECT USING (true);

-- Point transactions
CREATE TABLE public.point_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'earn',
  points INTEGER NOT NULL,
  description TEXT,
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.point_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.point_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Purchases
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  points_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- User settings
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  deals_alerts BOOLEAN NOT NULL DEFAULT true,
  points_alerts BOOLEAN NOT NULL DEFAULT true,
  tier_alerts BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile and settings on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bronze_tier_id UUID;
  new_barcode TEXT;
BEGIN
  SELECT id INTO bronze_tier_id FROM public.tiers WHERE name = 'Bronze' LIMIT 1;
  new_barcode := 'SNK-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random() * 10000)::text, 4, '0') || '-' || substring(NEW.id::text, 1, 4);
  
  INSERT INTO public.profiles (user_id, name, surname, email, phone, tier_id, barcode)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    bronze_tier_id,
    new_barcode
  );
  
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures', 'profile-pictures', true);
CREATE POLICY "Users can upload own profile picture" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own profile picture" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Profile pictures are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'profile-pictures');
