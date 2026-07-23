-- ========================================================================================
-- 1. UNIFIED SETTINGS TABLE
-- ========================================================================================

CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Profile
    full_name TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    website TEXT,
    
    -- Social Links
    linkedin TEXT,
    github TEXT,
    instagram TEXT,
    twitter TEXT,
    youtube TEXT,
    
    -- Assets (Stored as relative paths)
    avatar_url TEXT,
    resume_url TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    og_image_url TEXT,
    twitter_image_url TEXT,
    
    -- SEO
    seo_title TEXT,
    seo_description TEXT,
    keywords TEXT,
    author TEXT,
    language TEXT DEFAULT 'en',
    
    -- Theming
    site_title TEXT DEFAULT 'My Portfolio',
    primary_color TEXT DEFAULT '#3b82f6',
    secondary_color TEXT DEFAULT '#1d4ed8',
    dark_mode_default BOOLEAN DEFAULT false,
    footer_copyright TEXT DEFAULT '© 2026. All rights reserved.',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Auth manage own settings" ON public.settings FOR ALL USING (auth.uid() = user_id);

-- Trigger for updated_at (Requires function from schema.sql)
CREATE TRIGGER update_settings_modtime 
  BEFORE UPDATE ON public.settings 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- ========================================================================================
-- 2. MIGRATE EXISTING ADMIN
-- ========================================================================================

-- Automatically insert a row for the first user if it doesn't exist
INSERT INTO public.settings (user_id, full_name, email)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), email
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.settings)
LIMIT 1;

-- ========================================================================================
-- 3. STORAGE BUCKETS
-- ========================================================================================

-- Create Buckets (Safe to run if they don't exist yet)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('logos', 'logos', true),
  ('settings', 'settings', true),
  ('resume', 'resume', true),
  ('projects', 'projects', true),
  ('certificates', 'certificates', true),
  ('gallery', 'gallery', true),
  ('experience', 'experience', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Note: 'storage.objects' policies apply globally to all objects across these buckets.

-- Allow public read access to these specific public buckets
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('avatars', 'logos', 'settings', 'resume', 'projects', 'certificates', 'gallery', 'experience'));

-- Allow authenticated users (Admin/Editor) to upload/update/delete files
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id IN ('avatars', 'logos', 'settings', 'resume', 'projects', 'certificates', 'gallery', 'experience') 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id IN ('avatars', 'logos', 'settings', 'resume', 'projects', 'certificates', 'gallery', 'experience') 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING (
  bucket_id IN ('avatars', 'logos', 'settings', 'resume', 'projects', 'certificates', 'gallery', 'experience') 
  AND auth.role() = 'authenticated'
);
