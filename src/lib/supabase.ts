import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hkvjwhimitnmfyftxxmf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdmp3aGltaXRubWZ5ZnR4eG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDA2NDUsImV4cCI6MjA3NjQxNjY0NX0.gMeAOLY2gHI5mrFk_c6fP1pYFf6673XEb1Ffda7bMOg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
