-- Fix existing profiles table and set up for hackathon
-- This script works with an already existing profiles table

-- First, let's check if the profiles table has the correct structure
-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add major column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'major') THEN
        ALTER TABLE profiles ADD COLUMN major TEXT;
    END IF;

    -- Add grad_year column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'grad_year') THEN
        ALTER TABLE profiles ADD COLUMN grad_year INTEGER;
    END IF;

    -- Add parsed_skills column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'parsed_skills') THEN
        ALTER TABLE profiles ADD COLUMN parsed_skills JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add parsed_interests column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'parsed_interests') THEN
        ALTER TABLE profiles ADD COLUMN parsed_interests JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add parsed_resume_text column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'parsed_resume_text') THEN
        ALTER TABLE profiles ADD COLUMN parsed_resume_text TEXT;
    END IF;

    -- Add email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE profiles ADD COLUMN email TEXT UNIQUE;
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Enable Row Level Security (RLS) on profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow individual read access" ON profiles;
DROP POLICY IF EXISTS "Allow individual update access" ON profiles;
DROP POLICY IF EXISTS "Allow individual insert access" ON profiles;

-- Create RLS policies
CREATE POLICY "Allow individual read access" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Allow individual update access" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Allow individual insert access" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create trigger to automatically update updated_at when row is modified
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create or replace function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, parsed_skills, parsed_interests)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', '{}', '{}');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
