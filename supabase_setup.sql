-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    full_name TEXT,
    major TEXT,
    grad_year INTEGER,
    parsed_skills JSONB DEFAULT '{}'::jsonb,
    parsed_interests JSONB DEFAULT '{}'::jsonb,
    parsed_resume_text TEXT,
    email TEXT UNIQUE
);

-- Enable Row Level Security (RLS) on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Policy 1: Allow individual read access
CREATE POLICY "Allow individual read access" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Allow individual update access
CREATE POLICY "Allow individual update access" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy 3: Allow individual insert access
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

-- Create trigger to automatically update updated_at when row is modified
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
