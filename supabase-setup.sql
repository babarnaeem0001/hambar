-- Run this script in your Supabase SQL Editor

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    author_avatar TEXT NOT NULL,
    date TEXT NOT NULL,
    read_time TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    service_interested TEXT,
    budget_range TEXT,
    details TEXT,
    primary_service TEXT,
    additional_services TEXT[],
    nda_required TEXT,
    website_url TEXT,
    how_heard TEXT,
    meeting_date TEXT,
    meeting_time_slot TEXT,
    uploaded_files_count INTEGER,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    avatar TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn off RLS for public access (make sure to enable it later in production!)
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Fallback policies in case Supabase re-enables RLS by default or fails to disable it
DROP POLICY IF EXISTS "Allow public read" ON public.admins;
DROP POLICY IF EXISTS "Allow authed insert" ON public.admins;
DROP POLICY IF EXISTS "Allow authed update" ON public.admins;
DROP POLICY IF EXISTS "Allow authed delete" ON public.admins;

DROP POLICY IF EXISTS "Allow public read of admins" ON public.admins;
DROP POLICY IF EXISTS "Allow users to upsert their own admin profile" ON public.admins;

CREATE POLICY "Allow public read" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Allow authed insert" ON public.admins FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authed update" ON public.admins FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow authed delete" ON public.admins FOR DELETE USING (true);

-- Fallback policies for articles table
DROP POLICY IF EXISTS "Allow public read articles" ON public.articles;
DROP POLICY IF EXISTS "Allow public insert articles" ON public.articles;
DROP POLICY IF EXISTS "Allow public update articles" ON public.articles;
DROP POLICY IF EXISTS "Allow public delete articles" ON public.articles;

CREATE POLICY "Allow public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow public insert articles" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update articles" ON public.articles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete articles" ON public.articles FOR DELETE USING (true);

-- Fallback policies for submissions table
DROP POLICY IF EXISTS "Allow public read submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow public insert submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow public update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow public delete submissions" ON public.submissions;

CREATE POLICY "Allow public read submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update submissions" ON public.submissions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete submissions" ON public.submissions FOR DELETE USING (true);
