import { useState } from 'react';
import { Link } from 'react-router-dom';
import CoinIcon from './CoinIcon';
import MissionIcon from './MissionIcon';
import WalletPortal from './wallet/WalletPortal';
import NotificationBell from './NotificationBell';
import { useBalance } from '../hooks/useBalance';
import SearchBar from './search/SearchBar';
import SettingsMenu from './SettingsMenu';
import { useAuth } from '../context/AuthContext';
import MissionBoardPortal from './MissionBoardPortal';

const Navbar = () => {
  const [showWallet, setShowWallet] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const { user, setShowAuthModal } = useAuth();
  const { balance, loading } = useBalance();

  return (
    <nav className="fixed top-0 left-16 right-0 h-16 bg-[#12121A]/80 backdrop-blur-md z-40 px-6 flex items-center justify-between">
      <div className="flex-1 flex items-center">
        <Link to="/">
          <img 
            src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6e7f2a4c-b927-4623-b650-6cedaaab8364/dj1riiq-c56fe035-4762-4a53-8c3b-563b28b1c900.png/v1/fill/w_483,h_131/8bf988985cbd1890eb0d6179b3b2618c_by_prydley_studios_dj1riiq-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTMxIiwicGF0aCI6IlwvZlwvNmU3ZjJhNGMtYjkyNy00NjIzLWI2NTAtNmNlZGFhYWI4MzY0XC9kajFyaWlxLWM1NmZlMDM1LTQ3NjItNGE1My04YzNiLTU2M2IyOGIxYzkwMC5wbmciLCJ3aWR0aCI6Ijw9NDgzIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.2AtmvydvYifo29XXlYXiPIAyE1Hyj7Jup20EIcr713I"
            alt="Celflicks"
            className="h-[34px] w-auto mt-0.5 -translate-x-3 object-contain mr-6 cursor-pointer hover:opacity-80 transition-opacity" 
          />
        </Link>
        <div className="mr-12" onClick={() => setShowMissions(true)}>
          <MissionIcon />
        </div>
        <div className="ml-20">
          <SearchBar />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <button 
              onClick={() => setShowWallet(true)}
              className="flex items-center gap-3 bg-[#1E1E2A]/80 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5 hover:border-purple-500/30 transition-colors group"
            >
              <div className="relative">
                <CoinIcon size={20} />
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Balance</span>
                <span className="font-medium bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {loading ? (
                    <div className="h-4 w-16 bg-purple-600/20 animate-pulse rounded" />
                  ) : (
                    `${balance.toLocaleString()} XCE`
                  )}
                </span>
              </div>
            </button>
            <NotificationBell />
            <SettingsMenu />
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowAuthModal(true, 'login');
              }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative px-6 py-2 bg-[#1E1E2A] rounded-full leading-none flex items-center">
                <span className="text-gray-200 group-hover:text-white transition duration-200">Sign In</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                setShowAuthModal(true, 'signup');
              }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-60 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full leading-none flex items-center">
                <span className="font-medium text-white">Sign Up</span>
              </div>
            </button>
          </div>
        )}
        {showWallet && <WalletPortal onClose={() => setShowWallet(false)} />}
        {showMissions && <MissionBoardPortal onClose={() => setShowMissions(false)} />}
      </div>
    </nav>
  );
};

export default Navbar;