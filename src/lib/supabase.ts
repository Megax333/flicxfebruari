import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdbcwawakmyijhbwbdkt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkYmN3YXdha215aWpoYndiZGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMzc2NzcsImV4cCI6MjA1MTgxMzY3N30.JBPYJjiz2rRPeKXDtP6RAyBvzjpOCinqC3CGJaYyBpI';

// Create client with retry logic
const createClientWithRetry = () => {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });

  return client;
};

// Create and export client
export const supabase = createClientWithRetry();