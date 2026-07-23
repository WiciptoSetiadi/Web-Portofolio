-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Type for entity status
CREATE TYPE entity_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE user_role AS ENUM ('admin', 'editor');

-- 2. TABLES

-- 2.1 Profiles (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    avatar_url TEXT,
    resume_url TEXT,
    location TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    role user_role DEFAULT 'editor' NOT NULL,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Site Settings (Single Row)
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    site_title TEXT NOT NULL DEFAULT 'My Portfolio',
    site_description TEXT,
    seo_title TEXT,
    seo_description TEXT,
    og_image_url TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#3b82f6',
    google_analytics_id TEXT,
    custom_meta JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.3 Section Content
CREATE TABLE section_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    section_key TEXT UNIQUE NOT NULL,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    content JSONB DEFAULT '{}'::jsonb,
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.4 Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- 'project', 'certificate', 'gallery', 'achievement'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(slug, entity_type)
);

-- 2.5 Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    description TEXT,
    short_description TEXT,
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    status entity_status DEFAULT 'draft' NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.6 Skills
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    icon_name TEXT,
    proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
    sort_order INTEGER DEFAULT 0,
    status entity_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.7 Experience
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    responsibilities TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    status entity_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.8 Education
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    logo_url TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    status entity_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.9 Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    credential_id TEXT,
    credential_url TEXT,
    image_url TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    issue_date DATE,
    expiry_date DATE,
    sort_order INTEGER DEFAULT 0,
    status entity_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.10 Achievements
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    achieved_date DATE,
    sort_order INTEGER DEFAULT 0,
    status entity_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.11 Gallery
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    status entity_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.12 Contact Messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.13 Page Views
CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    country TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 3. TRIGGERS

-- 3.1 Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_site_settings_modtime BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_section_content_modtime BEFORE UPDATE ON section_content FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_skills_modtime BEFORE UPDATE ON skills FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_experience_modtime BEFORE UPDATE ON experience FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_education_modtime BEFORE UPDATE ON education FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_certificates_modtime BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_achievements_modtime BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_gallery_modtime BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 3.2 Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'admin'); -- Default first user to admin, others might need manual adjustment later
  
  -- Create initial site settings row for the new user
  INSERT INTO public.site_settings (user_id) VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 4. ROW LEVEL SECURITY (RLS)

-- Helper function to check role
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_editor() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, Auth manage
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Auth manage own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (is_admin());

-- Site Settings: Public read, Auth read, Admin manage
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (is_admin());

-- Section Content: Public read visible, Admin full, Editor update
CREATE POLICY "Public read visible section_content" ON section_content FOR SELECT USING (is_visible = true);
CREATE POLICY "Admin full access section_content" ON section_content FOR ALL USING (is_admin());
CREATE POLICY "Editor update section_content" ON section_content FOR UPDATE USING (is_editor());

-- Categories: Public read, Admin full, Editor read
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Editor read categories" ON categories FOR SELECT USING (is_editor());

-- Content Entities (Projects, Skills, etc): Public read published, Admin full, Editor insert/update
-- (Applying similar rules to all)
DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN SELECT unnest(ARRAY['projects', 'skills', 'experience', 'education', 'certificates', 'achievements', 'gallery'])
    LOOP
        EXECUTE format('CREATE POLICY "Public read published %I" ON %I FOR SELECT USING (status = ''published'');', t_name, t_name);
        EXECUTE format('CREATE POLICY "Admin full access %I" ON %I FOR ALL USING (is_admin());', t_name, t_name);
        EXECUTE format('CREATE POLICY "Editor insert %I" ON %I FOR INSERT WITH CHECK (is_editor());', t_name, t_name);
        EXECUTE format('CREATE POLICY "Editor update %I" ON %I FOR UPDATE USING (is_editor());', t_name, t_name);
    END LOOP;
END
$$;

-- Contact Messages: Public insert, Admin read/delete, Editor read
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access contact_messages" ON contact_messages FOR ALL USING (is_admin());
CREATE POLICY "Editor read contact_messages" ON contact_messages FOR SELECT USING (is_editor());

-- Page Views: Public insert, Admin/Editor read
CREATE POLICY "Public insert page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read page_views" ON page_views FOR SELECT USING (is_editor());


-- 5. INITIAL SEED DATA FOR SECTION CONTENT
-- This is executed manually or as part of initial migration
INSERT INTO section_content (section_key, title, sort_order, content) VALUES
('navbar', NULL, 1, '{"logo_text": "Portfolio", "links": [{"label": "Home", "href": "#hero"}, {"label": "About", "href": "#about"}, {"label": "Projects", "href": "#projects"}, {"label": "Skills", "href": "#skills"}, {"label": "Experience", "href": "#experience"}, {"label": "Contact", "href": "#contact"}], "cta_label": "Hire Me", "cta_href": "#contact"}'),
('hero', 'Welcome', 2, '{"greeting": "Hi, I''m", "name": "Wicipto Setiadi", "typing_texts": ["Full Stack Developer", "Software Architect", "UI/UX Designer"], "bio_short": "Passionate about building modern web applications with clean architecture and stunning designs.", "cta_primary": {"label": "View Projects", "href": "#projects"}, "cta_secondary": {"label": "Download CV", "href": "#"}, "show_social_icons": true, "show_avatar": true}'),
('about', 'About Me', 3, '{"stats": [{"label": "Projects", "value": "auto", "icon": "folder"}, {"label": "Years Exp", "value": "auto", "icon": "clock"}, {"label": "Certificates", "value": "auto", "icon": "award"}, {"label": "Skills", "value": "auto", "icon": "star"}], "bio_long": "I am a senior full-stack engineer with over 15 years of experience..."}'),
('projects', 'My Projects', 4, '{"filter_label": "Filter by:", "show_filter": true, "show_tags": true, "empty_state": "No projects yet."}'),
('skills', 'Skills & Expertise', 5, '{"show_proficiency": true, "show_filter": true, "layout": "grid"}'),
('experience', 'Professional Experience', 6, '{"layout": "timeline", "show_logo": true, "present_label": "Present"}'),
('education', 'Education History', 7, '{"layout": "timeline", "show_logo": true, "present_label": "Present"}'),
('certificates', 'Certifications', 8, '{"show_filter": true, "view_label": "View Certificate", "empty_state": "No certificates yet."}'),
('achievements', 'Achievements', 9, '{"show_date": true, "empty_state": "No achievements yet."}'),
('gallery', 'Gallery', 10, '{"layout": "masonry", "show_filter": true, "enable_lightbox": true, "empty_state": "No gallery items yet."}'),
('contact', 'Get in Touch', 11, '{"form_title": "Send me a message", "fields": {"name_label": "Your Name", "name_placeholder": "John Doe", "email_label": "Email Address", "email_placeholder": "john@example.com", "subject_label": "Subject", "subject_placeholder": "Project Inquiry", "message_label": "Message", "message_placeholder": "Tell me about your project..."}, "submit_label": "Send Message", "success_message": "Thank you! I''ll get back to you soon.", "show_info_card": true, "info_title": "Contact Information"}'),
('footer', NULL, 12, '{"copyright": "© 2026 Wicipto Setiadi. All rights reserved.", "tagline": "Built with passion and clean code.", "show_social": true, "links": [{"label": "Privacy Policy", "href": "/privacy"}, {"label": "Terms of Service", "href": "/terms"}]}');
