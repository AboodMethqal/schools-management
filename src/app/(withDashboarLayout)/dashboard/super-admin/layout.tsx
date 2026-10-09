"use client"

import React from "react"
import DashboardLayout from "@/components/shared/dashboard/DashboardLayout"
import { superAdminMenuItems } from "@/components/shared/dashboard/menu-items"
import { useRoleGuard } from "@/hooks/useRoleGurad"
import PageLoader from "@/components/shared/PageLoader"
import { useLanguage } from "@/context/LanguageProvider"

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRoleGuard("super_admin")
  const { language } = useLanguage()

  if (loading) return <PageLoader />

  return (
    <DashboardLayout
      title="Super Admin Dashboard"
      menuItems={superAdminMenuItems}
      activeColor="bg-blue-600"
      user={{
        name: user?.name || (language === 'ar' ? "مدير عام مثقال تك" : "System Administrator"),
        role: language === 'ar' ? "المشرف العام" : "Super Admin",
        initials: "MA",
        subText: language === 'ar' ? "إدارة النظام السحابي" : "Cloud System Administration"
      }}
    >
      {children}
    </DashboardLayout>
  )
}
