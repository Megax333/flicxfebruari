import React, { createContext, useContext, useState } from 'react';

interface ProfileContextType {
  showProfile: (handle: string) => void;
  hideProfile: () => void;
  activeProfile: string | null;
}

const ProfileContext = createContext<ProfileContextType>({
  showProfile: () => {},
  hideProfile: () => {},
  activeProfile: null
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeProfile, setActiveProfile] = useState<string | null>(null);

  const showProfile = (handle: string) => setActiveProfile(handle);
  const hideProfile = () => setActiveProfile(null);

  return (
    <ProfileContext.Provider value={{ showProfile, hideProfile, activeProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};