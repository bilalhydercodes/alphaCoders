'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sound } from '@/lib/sound';

export interface CharacterStats {
  id: string;
  strength: number;
  intellect: number;
  agility: number;
  vitality: number;
  spirit: number;
}

export interface InventoryItem {
  id: string;
  itemId: string;
  quantity: number;
  isEquipped: boolean;
  item: {
    id: string;
    name: string;
    description: string;
    category: string;
    cost: number;
    rarity: string;
    icon: string;
    statModifier: string | null;
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  title: string;
  level: number;
  xp: number;
  xpNeeded: number;
  gold: number;
  hp: number;
  maxHp: number;
  streak: number;
  companionMood: string;
  stats?: CharacterStats;
  inventory?: InventoryItem[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isMuted: boolean;
  toggleSound: () => void;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserOptimistic: (updater: (prev: User) => User) => void;
  triggerLumiReaction: (reaction: string, quote?: string) => void;
  currentReaction: { reaction: string; quote: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentReaction, setCurrentReaction] = useState<{ reaction: string; quote: string } | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    setIsMuted(sound.isMuted);
  }, [refreshUser]);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const triggerLumiReaction = (reaction: string, quote: string = '') => {
    setCurrentReaction({ reaction, quote });
    // Reset reaction back to ambient mood after 4.5s
    setTimeout(() => {
      setCurrentReaction(null);
    }, 4500);
  };

  const login = async (identifier: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      await refreshUser();
      sound.playClick();
      return { success: true };
    } catch {
      return { success: false, error: 'Network communication failure' };
    }
  };

  const register = async (username: string, email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      await refreshUser();
      sound.playLevelUp();
      return { success: true };
    } catch {
      return { success: false, error: 'Network communication failure' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      sound.playClick();
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserOptimistic = (updater: (prev: User) => User) => {
    setUser((prev) => (prev ? updater(prev) : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isMuted,
        toggleSound,
        login,
        register,
        logout,
        refreshUser,
        updateUserOptimistic,
        triggerLumiReaction,
        currentReaction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
