export type AuthUser = {
  id?: number | string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  avatar?: string | null;
  provider_name?: string | null;
  email_verified_at?: string | null;
  created_at?: string | null;
};

type ApiEnvelope = { status?: string; message?: string; data?: unknown; errors?: unknown };

export class AuthApiError extends Error {
  status: number;
  errors: unknown;
  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const TOKEN_KEY = 'datasculpt_token';
const USER_KEY = 'datasculpt_user';

export function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '') || '';
}

export function storedToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storedUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(USER_KEY) || 'null');
    return isRecord(value) ? (value as AuthUser) : null;
  } catch { return null; }
}

export function persistAuth(token: string, user?: AuthUser | null) {
  window.localStorage.setItem(TOKEN_KEY, token);
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function authRequest(path: string, init: RequestInit = {}, token?: string | null) {
  const base = apiBaseUrl();
  if (!base) throw new AuthApiError('Authentication service is not configured.', 0);
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${base}${path}`, { ...init, headers });
  const payload: unknown = await response.json().catch(() => null);
  const envelope = isRecord(payload) ? payload as ApiEnvelope : {};
  if (!response.ok) throw new AuthApiError(typeof envelope.message === 'string' ? envelope.message : 'Authentication request failed.', response.status, envelope.errors);
  return envelope;
}

export function extractUser(value: unknown): AuthUser | null {
  return isRecord(value) && (typeof value.email === 'string' || typeof value.username === 'string') ? value as AuthUser : null;
}

export function extractToken(value: unknown) {
  return isRecord(value) && typeof value.token === 'string' ? value.token : null;
}

export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  return error instanceof AuthApiError || error instanceof Error ? error.message : fallback;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
