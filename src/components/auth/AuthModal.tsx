import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

interface AuthModalProps {
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal = ({ onClose, initialMode = 'login' }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate username format
  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Trim inputs
      const trimmedEmail = email.toLowerCase().trim();
      const trimmedUsername = username.trim();
      const trimmedPassword = password;

      // Input validation
      if (!trimmedEmail || !trimmedPassword) {
        throw new Error('Please fill in all required fields');
      }

      if (!validateEmail(trimmedEmail)) {
        throw new Error('Please enter a valid email address');
      }

      if (trimmedPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (!isLogin) {
        if (!trimmedUsername) {
          throw new Error('Please enter a username');
        }

        if (!validateUsername(trimmedUsername)) {
          throw new Error('Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens');
        }

        // Check if username is available first
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', trimmedUsername)
          .maybeSingle();

        if (checkError) throw checkError;
        if (existingUser) {
          throw new Error('Username is already taken. Please choose another.');
        }
      }

      if (isLogin) {
        // Handle login
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        
        if (error) throw error;
        
        setSuccess(true);
        setTimeout(() => onClose?.(), 800);
      } else {
        // Handle signup with retries
        let retryCount = 0;
        const maxRetries = 3;
        let lastError = null;

        while (retryCount < maxRetries) {
          try {
            const { data, error: signUpError } = await supabase.auth.signUp({
              email: trimmedEmail,
              password: trimmedPassword,
              options: {
                data: {
                  username: trimmedUsername,
                  avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedUsername)}&background=random`
                }
              }
            });

            if (signUpError) throw signUpError;
            if (!data.user) throw new Error('No user data returned');

            setSuccess(true);
            setTimeout(() => onClose?.(), 800);
            return;
          } catch (err) {
            lastError = err;
            retryCount++;
            
            if (retryCount < maxRetries) {
              // Wait before retrying with exponential backoff
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
              continue;
            }
          }
        }

        // If we get here, all retries failed
        throw lastError || new Error('Failed to create account after multiple attempts');
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      // Handle specific error cases
      if (err.message?.includes('User already registered')) {
        setError('This email is already registered');
      } else if (err.message === 'Invalid login credentials') {
        setError('Invalid email or password');
      } else if (err.message?.includes('Username is already taken')) {
        setError('Username is already taken. Please choose another.');
      } else if (err.message?.includes('Database error')) {
        setError('Error creating account. Please try again.');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose} />
        
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle bg-[#1E1E2A] rounded-xl shadow-xl transform transition-all relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h2>
            {onClose && (
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#2A2A3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span>{isLogin ? 'Login successful!' : 'Sign up successful!'}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2.5 rounded-lg disabled:opacity-50 transition-colors"
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-400 hover:text-white transition-colors py-2"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};