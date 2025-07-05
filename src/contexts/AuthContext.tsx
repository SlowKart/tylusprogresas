"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState } from '@/types/auth';
import { authService } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshActiveProgram: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    activeProgram: null,
    progress: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          const activeProgram = await authService.getActiveProgram(user.id);
          let progress = null;
          
          if (activeProgram) {
            progress = await authService.getUserProgress(user.id, activeProgram.id);
          }

          setAuthState({
            user,
            isAuthenticated: true,
            activeProgram,
            progress
          });
        }
      } catch {
        // Auth initialization failed - silently continue with unauthenticated state
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await authService.login(email, password);
      const activeProgram = await authService.getActiveProgram(user.id);
      let progress = null;
      
      if (activeProgram) {
        progress = await authService.getUserProgress(user.id, activeProgram.id);
      }

      setAuthState({
        user,
        isAuthenticated: true,
        activeProgram,
        progress
      });
    } catch (error) {
      throw error; // Re-throw to handle in component
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const user = await authService.register(email, password, name);
      
      setAuthState({
        user,
        isAuthenticated: true,
        activeProgram: null,
        progress: null
      });
    } catch (error) {
      throw error; // Re-throw to handle in component
    }
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      activeProgram: null,
      progress: null
    });
  };

  const refreshActiveProgram = async () => {
    if (!authState.user) return;

    try {
      const activeProgram = await authService.getActiveProgram(authState.user.id);
      let progress = null;
      
      if (activeProgram) {
        progress = await authService.getUserProgress(authState.user.id, activeProgram.id);
      }

      setAuthState(prev => ({
        ...prev,
        activeProgram,
        progress
      }));
    } catch {
      // Program refresh failed - maintain current state
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshActiveProgram,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}