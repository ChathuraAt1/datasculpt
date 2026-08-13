'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiBaseUrl, authRequest, AuthUser, clearAuth, extractToken, extractUser, persistAuth, sha256, storedToken, storedUser } from '@/lib/auth';

type Credentials = { email: string; password: string };
type Registration = Credentials & { username: string; firstName: string; lastName: string };
type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<AuthUser>;
  register: (details: Registration) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const currentToken = token || storedToken();
    if (!currentToken) { setUser(null); setToken(null); return null; }
    try {
      const envelope = await authRequest('/api/user', {}, currentToken);
      const nextUser = extractUser(envelope.data);
      if (!nextUser) throw new Error('The authenticated user response was invalid.');
      persistAuth(currentToken, nextUser);
      setToken(currentToken); setUser(nextUser);
      return nextUser;
    } catch (error) {
      if (error instanceof Error && 'status' in error && (error as { status?: number }).status === 401) clearAuth();
      setToken(null); setUser(null); return null;
    }
  }, [token]);

  useEffect(() => {
    const initialToken = storedToken();
    setToken(initialToken);
    setUser(storedUser());
    void (async () => { if (initialToken) await refreshUser(); setLoading(false); })();
    // Auth restoration intentionally runs once after browser hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async ({ email, password }: Credentials) => {
    const passwordHash = await sha256(password);
    const envelope = await authRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password_hash: passwordHash }) });
    const nextToken = extractToken(envelope.data);
    const nextUser = extractUser(isRecord(envelope.data) ? envelope.data.user : null);
    if (!nextToken || !nextUser) throw new Error('The login response was incomplete.');
    persistAuth(nextToken, nextUser); setToken(nextToken); setUser(nextUser); return nextUser;
  }, []);

  const register = useCallback(async ({ email, password, username, firstName, lastName }: Registration) => {
    const passwordHash = await sha256(password);
    const envelope = await authRequest('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, first_name: firstName || null, last_name: lastName || null, email, password_hash: passwordHash, password_hash_confirmation: passwordHash }) });
    const nextToken = extractToken(envelope.data);
    const nextUser = extractUser(isRecord(envelope.data) ? envelope.data.user : null);
    if (!nextToken || !nextUser) throw new Error('The registration response was incomplete.');
    persistAuth(nextToken, nextUser); setToken(nextToken); setUser(nextUser); return nextUser;
  }, []);

  const logout = useCallback(async () => {
    const currentToken = token || storedToken();
    try { if (currentToken && apiBaseUrl()) await authRequest('/api/auth/logout', { method: 'POST' }, currentToken); } catch { /* local sign-out still completes */ }
    clearAuth(); setToken(null); setUser(null);
  }, [token]);

  const value = useMemo(() => ({ user, token, loading, isAuthenticated: Boolean(token && user), login, register, logout, refreshUser }), [user, token, loading, login, register, logout, refreshUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider.');
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
