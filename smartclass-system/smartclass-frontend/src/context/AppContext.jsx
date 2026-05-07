// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, api } from '../lib/api';

const AuthContext = createContext(null);
const A11yContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(auth.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { user } = await api.login(email, password);
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

const A11Y_KEY = 'smartclass.a11y';

export function A11yProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(A11Y_KEY)) || {
        fontScale: 1,
        highContrast: false,
      };
    } catch {
      return { fontScale: 1, highContrast: false };
    }
  });

  useEffect(() => {
    localStorage.setItem(A11Y_KEY, JSON.stringify(settings));
    document.documentElement.style.fontSize = `${settings.fontScale * 100}%`;
    document.documentElement.classList.toggle('hc', settings.highContrast);
  }, [settings]);

  const update = (patch) => setSettings(prev => ({ ...prev, ...patch }));

  return (
    <A11yContext.Provider value={{ settings, update }}>
      {children}
    </A11yContext.Provider>
  );
}

export const useA11y = () => useContext(A11yContext);
