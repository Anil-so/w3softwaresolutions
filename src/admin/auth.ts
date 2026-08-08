const ADMIN_SESSION_KEY = 'w3-admin-session';
const ADMIN_PASSWORD_HASH_KEY = 'w3-admin-password-hash';
const ADMIN_EMAIL = 'admin@w3solutions.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

type AdminSession = {
  email: string;
  token: string;
  expiresAt: number;
};

function readSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(ADMIN_SESSION_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as AdminSession;
    if (!parsed?.token || Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

function encodeHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password: string) {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return btoa(password);
  }

  const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return encodeHex(digest);
}

async function getStoredPasswordHash() {
  if (typeof window === 'undefined') {
    return '';
  }

  const stored = window.localStorage.getItem(ADMIN_PASSWORD_HASH_KEY);
  if (stored) {
    return stored;
  }

  const initialHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
  window.localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, initialHash);
  return initialHash;
}

export async function signInAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return false;
  }

  const storedHash = await getStoredPasswordHash();
  const suppliedHash = await hashPassword(password);

  if (normalizedEmail !== ADMIN_EMAIL || suppliedHash !== storedHash) {
    return false;
  }

  const token = `jwt.${window.btoa(`${normalizedEmail}:${Date.now()}`)}`;
  const session: AdminSession = {
    email: normalizedEmail,
    token,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return true;
}

export async function requestAdminPasswordReset(email: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

export async function resetAdminPassword(email: string, newPassword: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== ADMIN_EMAIL || !newPassword || newPassword.length < 6) {
    return false;
  }

  const newHash = await hashPassword(newPassword);
  window.localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, newHash);
  return true;
}

export function signOutAdmin() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

export function isAdminAuthenticated() {
  return Boolean(readSession());
}

export function getAdminSession() {
  return readSession();
}
