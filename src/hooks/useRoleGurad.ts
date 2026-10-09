import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

type UserRole = "super_admin" | "admin" | "teacher" | "student" | "parent" | "accountant";

export const useRoleGuard = (allowedRole: UserRole) => {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Still loading — wait for both user and role to resolve
    if (loading) return;

    // User not logged in
    if (!user) {
      router.push('/login');
      return;
    }

    // User is logged in but role not yet resolved (async fetch still pending)
    if (!role) return;

    // Wrong role
    if (role !== allowedRole) {
      router.push('/unauthorized');
    }
  }, [user, role, loading, router, allowedRole]);

  return { user, role, loading };
};
