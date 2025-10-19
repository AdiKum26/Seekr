import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types/auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth...');

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('AuthContext: Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user) {
          console.log('AuthContext: User found, creating basic user object');
          // Create a basic user object immediately without database fetch
          const basicUser = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
            parsed_skills: {},
            parsed_interests: {},
          };
          if (isMounted) {
            setUser(basicUser);
            setLoading(false);
          }

          // Try to fetch profile in background (non-blocking)
          fetchUserProfileInBackground(session.user.id);
        } else {
          console.log('AuthContext: No user found');
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('AuthContext: Error in initializeAuth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state change:', event);

        if (!isMounted) return;

        try {
          if (session?.user) {
            // Create basic user object immediately
            const basicUser = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
              parsed_skills: {},
              parsed_interests: {},
            };
            setUser(basicUser);
            setLoading(false);

            // Try to fetch profile in background
            fetchUserProfileInBackground(session.user.id);
          } else {
            setUser(null);
            setLoading(false);
          }
        } catch (error) {
          console.error('AuthContext: Error in auth state change:', error);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Non-blocking profile fetch
  const fetchUserProfileInBackground = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching profile in background for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('AuthContext: No profile found in database - this is normal for new users');
        } else {
          console.error('AuthContext: Error fetching user profile:', error);
        }
        return;
      }

      if (data) {
        console.log('AuthContext: Profile fetched successfully, updating user');
        setUser(data);
      }
    } catch (error) {
      console.error('AuthContext: Error fetching user profile in background:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('AuthContext: Attempting sign in for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('AuthContext: Sign in error:', error);
        setLoading(false);
        return { error };
      }

      console.log('AuthContext: Sign in successful');
      // The onAuthStateChange will handle setting the user and loading state
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Sign in exception:', error);
      setLoading(false);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      console.log('AuthContext: Attempting sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (!error && data.user) {
        console.log('AuthContext: Sign up successful');

        // Create profile record in background (non-blocking)
        supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            parsed_skills: {},
            parsed_interests: {},
          })
          .then(({ error: profileError }) => {
            if (profileError) {
              console.error('AuthContext: Error creating profile:', profileError);
            } else {
              console.log('AuthContext: Profile created successfully');
            }
          });

        // For hackathon: automatically sign in the user after successful signup
        if (data.session) {
          console.log('AuthContext: Auto sign-in after signup');
        }
      }

      setLoading(false);
      return { error };
    } catch (error) {
      console.error('AuthContext: Sign up exception:', error);
      setLoading(false);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log('AuthContext: Signing out');
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('AuthContext: Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
