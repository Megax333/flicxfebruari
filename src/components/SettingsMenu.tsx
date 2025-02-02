import React, { useState, useRef, useEffect } from 'react';
import { Settings, LogOut, Shield } from 'lucide-react';
import AdminPanel from './admin/AdminPanel';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../hooks/useAdmin';

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      await supabase.auth.signOut({ scope: 'local' });
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (globalSignOutError) {
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
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
        >
          <Settings size={20} className="text-gray-400 group-hover:text-white transition-colors" />
        </button>

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

export default SettingsMenu;