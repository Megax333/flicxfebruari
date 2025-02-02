import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ExpandableSidebar from './components/ExpandableSidebar';
import DiscoverPage from './pages/DiscoverPage';
import CommunityPage from './pages/CommunityPage';
import AudioRoomsPage from './pages/AudioRoomsPage';
import MessagesPage from './pages/MessagesPage';
import WatchTogetherPage from './pages/WatchTogetherPage';
import SavedPage from './pages/SavedPage';
import HistoryPage from './pages/HistoryPage';
import TempProfileModal from './components/TempProfileModal';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <div className="min-h-screen bg-[#0A0A0F] text-white">
            <Navbar />
            <ExpandableSidebar />
            <div className="ml-16">
              <Routes>
                <Route path="/" element={<DiscoverPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/messages/:username" element={<MessagesPage />} />
                <Route path="/audio" element={<AudioRoomsPage />} />
                <Route path="/watch-together" element={<WatchTogetherPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </div>
            <TempProfileModal />
          </div>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;