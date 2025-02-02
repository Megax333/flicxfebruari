import React, { useState, useRef, useEffect } from 'react';
import { Settings, LogOut, Shield } from 'lucide-react';
import AdminPanel from './admin/AdminPanel';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext'; 
import { useAdmin } from '../hooks/useAdmin';
import { useProfile } from '../hooks/useProfile';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { profile, loading } = useProfile(user?.id);
  const { isAdmin } = useAdmin();

  const handleLogout = async () => {
    try {
      // First clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Then sign out locally first
      await supabase.auth.signOut({ scope: 'local' });
      
      // Finally attempt global signout
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (globalSignOutError) {
        // Ignore global signout errors since we've already cleared local state
        console.debug('Global sign out failed:', globalSignOutError);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const toggleBodyScroll = () => {
      document.body.classList.toggle('admin-panel-open', showAdminPanel);
    };

    document.addEventListener('mousedown', handleClickOutside);
    toggleBodyScroll();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('admin-panel-open');
    };
  }, [showAdminPanel]);

  return (
    <>
      <div ref={menuRef} className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:bg-white/5 px-3 py-2 rounded-lg transition-colors"
        >
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-purple-600/20 animate-pulse" />
          ) : (
            <img
              src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username || 'User'}`}
              alt={profile?.username || 'User avatar'}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium">{profile?.username || 'User'}</span>
        </div>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#1E1E2A] rounded-xl overflow-hidden shadow-xl z-50">
            <div className="p-2">
            {isAdmin && (
              <button
                onClick={() => {
                  setShowAdminPanel(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <Shield size={18} />
                <span>Admin Panel</span>
              </button>
            )}
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left text-red-400"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </>
  );
};

export default UserMenu;