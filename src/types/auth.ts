export interface User {
  id: string;
  email?: string;
  full_name?: string;
  major?: string;
  grad_year?: number;
  parsed_skills?: Record<string, any>;
  parsed_interests?: Record<string, any>;
  parsed_resume_text?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}
