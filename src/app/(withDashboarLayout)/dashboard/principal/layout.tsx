"use client"

import React from "react"
import DashboardLayout from "@/components/shared/dashboard/DashboardLayout"
import { principalMenuItems } from "@/components/shared/dashboard/menu-items"
import { useRoleGuard } from "@/hooks/useRoleGurad"
import PageLoader from "@/components/shared/PageLoader"
import { useLanguage } from "@/context/LanguageProvider"

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRoleGuard("admin")
  const { language } = useLanguage()

  if (loading) return <PageLoader />

  return (
    <DashboardLayout
      title="Principal Dashboard"
      menuItems={principalMenuItems}
      activeColor="bg-blue-600"
      user={{
        name: user?.name || (language === 'ar' ? "د. أحمد الشامي" : "Dr. Ahmed Al-Shami"),
        role: language === 'ar' ? "مدير المدرسة" : "Principal",
        initials: "AS",
        subText: language === 'ar' ? "إدارة المدرسة" : "School Administration"
      }}
    >
      {children}
    </DashboardLayout>
  )
}
