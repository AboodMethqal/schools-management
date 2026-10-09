"use client"

import React from "react"
import DashboardLayout from "@/components/shared/dashboard/DashboardLayout"
import { accountantMenuItems } from "@/components/shared/dashboard/menu-items"
import { useRoleGuard } from "@/hooks/useRoleGurad"
import PageLoader from "@/components/shared/PageLoader"
import { useLanguage } from "@/context/LanguageProvider"

export default function AccountantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRoleGuard("accountant")
  const { language } = useLanguage()

  if (loading) return <PageLoader />

  return (
    <DashboardLayout
      title="Accountant Dashboard"
      menuItems={accountantMenuItems}
      activeColor="bg-blue-600"
      user={{
        name: user?.name || (language === 'ar' ? "سالم باعباد المحاسب" : "Salem Baabbad (Accountant)"),
        role: language === 'ar' ? "محاسب" : "Accountant",
        initials: "SB",
        subText: language === 'ar' ? "قسم الحسابات والمالية" : "Accounts & Finance Department"
      }}
    >
      {children}
    </DashboardLayout>
  )
}
