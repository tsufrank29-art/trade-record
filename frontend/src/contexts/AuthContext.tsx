import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/api/axios';

export type AuthUser = {
  id: number;
  email: string;
  nickname: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthContextShape = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);
const TOKEN_KEY = 'stockclub_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      }
      setLoading(false);
    })();
  }, []);

  const login = async ({ email, password }: LoginPayload) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: jwt, user: authUser } = response.data;
    setToken(jwt);
    setUser(authUser);
    api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    await AsyncStorage.setItem(TOKEN_KEY, jwt);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common.Authorization;
    await AsyncStorage.removeItem(TOKEN_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
};
