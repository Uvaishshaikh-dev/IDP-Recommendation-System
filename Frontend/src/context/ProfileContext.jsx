import { createContext, useContext, useMemo, useState } from 'react';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    targetRole: ''
  });

  const value = useMemo(() => ({
    profile,

    updateProfile: (changes) => {
      setProfile(current => ({
        ...current,
        ...changes
      }));
    }
  }), [profile]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used inside ProfileProvider');
  }

  return context;
}