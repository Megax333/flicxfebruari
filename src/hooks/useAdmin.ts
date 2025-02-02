import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          // Log error but don't throw - gracefully handle failure
          console.error('Error checking admin status:', error);
          setError(error);
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(data?.username === 'admin');
        setError(null);
      } catch (error) {
        // Handle unexpected errors
        console.error('Unexpected error checking admin status:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkAdminStatus();

    // Set up periodic checks
    const checkInterval = setInterval(checkAdminStatus, 30000); // Check every 30 seconds

    return () => {
      clearInterval(checkInterval);
    };
  }, [user]);

  return { 
    isAdmin, 
    loading,
    error,
    // Add retry function for manual retries
    retry: async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user?.id)
          .maybeSingle();

        if (error) throw error;
        setIsAdmin(data?.username === 'admin');
      } catch (error) {
        console.error('Error retrying admin check:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
  };
};