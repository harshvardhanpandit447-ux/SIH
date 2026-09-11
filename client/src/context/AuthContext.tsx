import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../utils/apiConfig';

export type UserRole = 'FARMER' | 'FPO' | 'BUYER' | 'ADMIN';

export interface CropMembership {
  id: string;
  farmerId: string;
  farmerName?: string;
  crop: string;
  cropCategory?: string;
  fpoId: string;
  fpoName: string;
  status: 'ACTIVE' | 'PENDING' | 'PAUSED';
  enrolledDate?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  role: UserRole;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  joinedFpoId?: string;
  joinedFpoName?: string;
  cropMemberships?: CropMembership[];
  trustScore?: number;
  contactPerson?: string;
  registrationNumber?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agrovision_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agrovision_token') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('agrovision_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agrovision_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('agrovision_token', token);
    } else {
      localStorage.removeItem('agrovision_token');
    }
  }, [token]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed' };
      }
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Could not connect to backend server' };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Registration failed' };
      }
      // Auto login after register
      setUser(result.user);
      setToken(`agv_token_${result.user.id}_${Date.now()}`);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Registration failed to reach server' };
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const quickDemoLogin = async (role: UserRole) => {
    let email = 'farmer@agrovision.in';
    let password = 'farmer123';
    if (role === 'FPO') {
      email = 'fpo@agrovision.in';
      password = 'fpo123';
    } else if (role === 'BUYER') {
      email = 'buyer@agrovision.in';
      password = 'buyer123';
    } else if (role === 'ADMIN') {
      email = 'admin@agrovision.in';
      password = 'admin123';
    }
    await login({ email, password });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickDemoLogin,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
