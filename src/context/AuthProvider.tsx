'use client';

import { createContext, useEffect, useState, useCallback } from 'react';
import { UserRole } from '@/types/roles';

const VALID_ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'teacher',
  'student',
  'parent',
  'accountant',
];

function normalizeRole(role?: string | null): UserRole | null {
  if (!role) return null;

  const cleanedRole = role.trim().toLowerCase();
  return VALID_ROLES.includes(cleanedRole as UserRole)
    ? (cleanedRole as UserRole)
    : null;
}

type AuthContextType = {
  user: any;
  role: UserRole | null;
  loading: boolean;

  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: any; role: UserRole | null; mustChangePassword?: boolean }>;

  signOut: () => Promise<void>;

  resetPassword: (email: string) => Promise<{ error: any }>;

  updatePassword: (password: string) => Promise<{ error: any }>;

  signUp: (
    email: string,
    password: string,
    role?: UserRole,
  ) => Promise<{ data: any; error: any }>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // SESSION CHECK ON MOUNT & REFRESH
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const sessionRes = await fetch('/api/auth/session', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData?.user && isMounted) {
            setUser(sessionData.user);
            const resolvedRole = normalizeRole(sessionData.role);
            setRole(resolvedRole);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Session verification check:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // ========================
  // SIGN IN (OFFLINE / LOCAL DEMO)
  // ========================
  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.user) {
        setUser(data.user);
        const resolvedRole = normalizeRole(data.role);
        setRole(resolvedRole);
        const mustChange = !!data?.mustChangePassword || !!data?.user?.mustChangePassword;
        return { error: null, role: resolvedRole, mustChangePassword: mustChange };
      }

      return {
        error: new Error(
          data?.error ||
            'بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور / Invalid credentials'
        ),
        role: null,
      };
    } catch (err: any) {
      console.error('Sign-in error:', err);
      return {
        error: new Error(err?.message || 'فشل الاتصال بنظام المصادقة المحلي'),
        role: null,
      };
    }
  };

  // ========================
  // SIGN OUT
  // ========================
  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Sign-out error:', err);
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  // ========================
  // SIGN UP (DEMO SIMULATION)
  // ========================
  const signUp = async (email: string, password: string, signupRole?: UserRole) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          roleKey: signupRole || 'student',
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.user) {
        setUser(data.user);
        setRole(normalizeRole(data.role));
        return { data: data.user, error: null };
      }

      return { data: null, error: new Error(data?.error || 'Registration failed') };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  // ========================
  // FORGOT PASSWORD
  // ========================
  const resetPassword = async (_email: string) => {
    // In demo mode, simulate success instantly
    return { error: null };
  };

  // ========================
  // UPDATE PASSWORD
  // ========================
  const updatePassword = async (_password: string) => {
    // In demo mode, simulate success instantly
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
