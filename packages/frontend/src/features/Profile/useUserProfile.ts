import { useState, useEffect } from 'react';
import { UserProfile, getCurrentAge } from './types';

const STORAGE_KEY = 'logikids_user_profile';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        setProfile(parsed);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to localStorage
  const saveProfile = (newProfile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  // Clear profile
  const clearProfile = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProfile(null);
    } catch (error) {
      console.error('Error clearing user profile:', error);
    }
  };

  // Get current age (recalculated based on time elapsed)
  const currentAge = profile ? getCurrentAge(profile) : undefined;

  return {
    profile,
    currentAge,
    gender: profile?.gender || undefined,
    saveProfile,
    clearProfile,
    isLoading,
    hasProfile: !!profile,
  };
}
