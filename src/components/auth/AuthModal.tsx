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
        // Handle signup
        try {
          // Simple signup without retries
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: trimmedEmail,
            password: trimmedPassword,
            options: {
              data: {
                username: trimmedUsername
              }
            }
          });

          if (signUpError) throw signUpError;
          if (!authData.user) throw new Error('No user data returned');

          // Wait a moment for the trigger to complete
          await new Promise(resolve => setTimeout(resolve, 1000));

          setSuccess(true);
          setTimeout(() => onClose?.(), 800);
        } catch (err) {
          console.error('Signup error details:', {
            message: err.message,
            details: err.details,
            hint: err.hint,
            code: err.code
          });
          throw err;
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      // Simplified error handling
      if (err.message?.includes('already registered')) {
        setError('This email is already registered');
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else {
        setError('Error creating account. Please try again and make sure your username is unique.');
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