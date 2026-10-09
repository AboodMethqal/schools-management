"use client";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Dashboard Root Layout
 * This layout only wraps dashboard routes without adding any Ui
 * Each role (accountant, admin, teacher, etc.) has its own layout
 */
export default function DashboardLayout({ children }: LayoutProps) {
  // Simply render children - let nested layouts handle their own UI
  return <>{children}</>;
}
